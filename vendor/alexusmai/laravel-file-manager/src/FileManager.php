<?php

namespace Alexusmai\LaravelFileManager;

use Alexusmai\LaravelFileManager\Events\Deleted;
use Alexusmai\LaravelFileManager\Events\Download;
use Alexusmai\LaravelFileManager\Services\ConfigService\ConfigRepository;
use Alexusmai\LaravelFileManager\Services\TransferService\TransferFactory;
use Alexusmai\LaravelFileManager\Traits\CheckTrait;
use Alexusmai\LaravelFileManager\Traits\ContentTrait;
use Alexusmai\LaravelFileManager\Traits\PathTrait;
use App\Models\Deleted_history;
use App\Models\Download_history;
use App\Models\file_uploading_history;
use App\Models\Pest_history;
use App\Models\Rename_history;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use League\Flysystem\FilesystemException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileManager
{
    use PathTrait, ContentTrait, CheckTrait;

    /**
     * @var ConfigRepository
     */
    public ConfigRepository $configRepository;

    /**
     * FileManager constructor.
     *
     * @param ConfigRepository $configRepository
     */
    public function __construct(ConfigRepository $configRepository)
    {
        $this->configRepository = $configRepository;
    }

    /**
     * Initialize App
     *
     * @return array
     */
    public function initialize(): array
    {
        if (!config()->has('file-manager')) {
            return [
                'result' => [
                    'status'  => 'danger',
                    'message' => 'noConfig',
                ],
            ];
        }

        $config = [
            'acl'           => $this->configRepository->getAcl(),
            'leftDisk'      => $this->configRepository->getLeftDisk(),
            'rightDisk'     => $this->configRepository->getRightDisk(),
            'leftPath'      => $this->configRepository->getLeftPath(),
            'rightPath'     => $this->configRepository->getRightPath(),
            'windowsConfig' => $this->configRepository->getWindowsConfig(),
            'hiddenFiles'   => $this->configRepository->getHiddenFiles(),
        ];

        // disk list
        foreach ($this->configRepository->getDiskList() as $disk) {
            if (array_key_exists($disk, config('filesystems.disks'))) {
                $config['disks'][$disk] = Arr::only(
                    config('filesystems.disks')[$disk], ['driver']
                );
            }
        }

        // get language
        $config['lang'] = app()->getLocale();

        return [
            'result' => [
                'status'  => 'success',
                'message' => null,
            ],
            'config' => $config,
        ];
    }

    /**
     * Get files and directories for the selected path and disk
     *
     * @param $disk
     * @param $path
     *
     * @return array
     * @throws FilesystemException
     */
    public function content($disk, $path): array
    {
        $content = $this->getContent($disk, $path);

        return [
            'result'      => [
                'status'  => 'success',
                'message' => null,
            ],
            'directories' => $content['directories'],
            'files'       => $content['files'],
        ];
    }

    /**
     * Get part of the directory tree
     *
     * @param $disk
     * @param $path
     *
     * @return array
     * @throws FilesystemException
     */
    public function tree($disk, $path): array
    {
        $directories = $this->getDirectoriesTree($disk, $path);

        return [
            'result'      => [
                'status'  => 'success',
                'message' => null,
            ],
            'directories' => $directories,
        ];
    }

    /**
     * Upload files
     *
     * @param string|null $disk
     * @param string|null $path
     * @param array|null  $files
     * @param bool        $overwrite
     *
     * @return array
     */
    public function upload($disk, $path, $files, $overwrite): array
    {
        $fileNotUploaded = false;

        foreach ($files as $file) {
            // skip or overwrite files
            if (!$overwrite && Storage::disk($disk)->exists($path . '/' . $file->getClientOriginalName())) {
                continue;
            }

            // check file size
            if ($this->configRepository->getMaxUploadFileSize()
                && $file->getSize() / 1024 > $this->configRepository->getMaxUploadFileSize()
            ) {
                $fileNotUploaded = true;
                continue;
            }

            // check file type
            if ($this->configRepository->getAllowFileTypes()
                && !in_array(
                    $file->getClientOriginalExtension(),
                    $this->configRepository->getAllowFileTypes()
                )
            ) {
                $fileNotUploaded = true;
                continue;
            }

            $name = $file->getClientOriginalName();
            if ($this->configRepository->getSlugifyNames()) {
                $name = Str::slug(
                        Str::replace(
                            '.' . $file->getClientOriginalExtension(),
                            '',
                            $name
                        )
                    ) . '.' . $file->getClientOriginalExtension();
            }
            file_uploading_history::create([
                'status'    =>  'success',
                'message'   =>  'uploaded',
                'disk_name' =>  $disk,
                'path'      =>  $path,
                'file_name' =>  $name,
                'overwrite' =>  $overwrite,
                'created_by'=>  Auth::user()->id,
            ]);
            // overwrite or save file
            Storage::disk($disk)->putFileAs(
                $path,
                $file,
                $name
            );
        }

        if ($fileNotUploaded) {
            return [
                'result' => [
                    'status'  => 'warning',
                    'message' => 'notAllUploaded',
                ],
            ];
        }

        return [
            'result' => [
                'status'  => 'success',
                'message' => 'uploaded',
            ],
        ];
    }

    /**
     * Delete files and folders
     *
     * @param $disk
     * @param $items
     *
     * @return array
     */
    public function delete($disk, $items): array
    {
        $deletedItems = [];

        foreach ($items as $item) {
            if (!Storage::disk($disk)->exists($item['path'])) {
                continue;
            } else {
                Deleted_history::create([
                    'disk_name' =>  $disk,
                    'path'      =>  $item['path'],
                    'type'      =>  $item['type'],
                    'created_by'=>  Auth::user()->id,
                ]);
                if ($item['type'] === 'dir') {
                    Storage::disk($disk)->deleteDirectory($item['path']);
                } else {
                    Storage::disk($disk)->delete($item['path']);
                }
            }

            $deletedItems[] = $item;
        }

        event(new Deleted($disk, $deletedItems));

        return [
            'result' => [
                'status'  => 'success',
                'message' => 'deleted',
            ],
        ];
    }

    /**
     * Copy / Cut - Files and Directories
     *
     * @param $disk
     * @param $path
     * @param $clipboard
     *
     * @return array
     */
    public function paste($disk, $path, $clipboard): array
    {
        $auth = Auth::user();
        // compare disk names
        if ($disk !== $clipboard['disk']) {

            if (!$this->checkDisk($clipboard['disk'])) {
                return $this->notFoundMessage();
            }
        }

        $transferService = TransferFactory::build($disk, $path, $clipboard);
        $transferServiceArray = (array) $transferService;
        $rs = $transferService->filesTransfer();
        if (count($clipboard['directories']))
        {
            $i=0;
            while (count($clipboard['directories']) > $i)
            {
                Pest_history::create([
                    'status'=>$rs['result']['status'],
                    'message'=>$rs['result']['message'],
                    'type'=>$transferService->clipboard['type'],
                    'disk_name'=>$disk,
                    'to'=>$path,
                    'from'=>$clipboard['directories'][$i],
                    'document_type'=>'directories',
                    'created_by'=>$auth->id,
                ]);
                $i++;
            }
        }
        if (count($clipboard['files']))
        {
            $i=0;
            while (count($clipboard['files']) > $i)
            {
                Pest_history::create([
                    'status'=>$rs['result']['status'],
                    'message'=>$rs['result']['message'],
                    'type'=>$transferService->clipboard['type'],
                    'disk_name'=>$disk,
                    'to'=>$path,
                    'from'=>$clipboard['files'][$i],
                    'document_type'=>'files',
                    'created_by'=>$auth->id,
                ]);
                $i++;
            }
        }
        return $rs;
    }

    /**
     * Rename file or folder
     *
     * @param $disk
     * @param $newName
     * @param $oldName
     *
     * @return array
     */
    public function rename($disk, $newName, $oldName): array
    {
        Storage::disk($disk)->move($oldName, $newName);
        Rename_history::create([
            'status'=>'success',
            'message'=>'renamed',
            'disk_name'=>$disk,
            'old_name'=>$oldName,
            'new_name'=>$newName,
            'created_by'=>Auth::user()->id,
        ]);
        return [
            'result' => [
                'status'  => 'success',
                'message' => 'renamed',
            ],
        ];
    }

    /**
     * Download selected file
     *
     * @param $disk
     * @param $path
     *
     * @return StreamedResponse
     */
    public function download($disk, $path): StreamedResponse
    {
        // if file name not in ASCII format
        if (!preg_match('/^[\x20-\x7e]*$/', basename($path))) {
            $filename = Str::ascii(basename($path));
        } else {
            $filename = basename($path);
        }
        try {
            Download_history::create([
                'disk_name' =>  $disk,
                'path'      =>  $path,
                'file_name' =>  $filename,
                'created_by'=>  Auth::user()->id,
            ]);
            return Storage::disk($disk)->download($path, $filename);
        }catch (\Throwable $exception)
        {
            return json($exception);
        }

    }

    /**
     * Create thumbnails
     *
     * @param $disk
     * @param $path
     *
     * @return Response|mixed
     * @throws BindingResolutionException
     */
    public function thumbnails($disk, $path): mixed
    {
        if ($this->configRepository->getCache()) {
            $thumbnail = Image::cache(function ($image) use ($disk, $path) {
                $image->make(Storage::disk($disk)->get($path))->fit(80);
            }, $this->configRepository->getCache());

            // output
            return response()->make(
                $thumbnail,
                200,
                ['Content-Type' => Storage::disk($disk)->mimeType($path)]
            );
        }

        $thumbnail = Image::make(Storage::disk($disk)->get($path))->fit(80);

        return $thumbnail->response();
    }

    /**
     * Image preview
     *
     * @param $disk
     * @param $path
     *
     * @return mixed
     */
    public function preview($disk, $path): mixed
    {
        $preview = Image::make(Storage::disk($disk)->get($path));

        return $preview->response();
    }

    /**
     * Get file URL
     *
     * @param $disk
     * @param $path
     *
     * @return array
     */
    public function url($disk, $path): array
    {
        return [
            'result' => [
                'status'  => 'success',
                'message' => null,
            ],
            'url'    => Storage::disk($disk)->url($path),
        ];
    }

    /**
     * Create new directory
     *
     * @param $disk
     * @param $path
     * @param $name
     *
     * @return array
     */
    public function createDirectory($disk, $path, $name)
    {
        $directoryName = $this->newPath($path, $name);

        if (Storage::disk($disk)->exists($directoryName)) {
            return [
                'result' => [
                    'status'  => 'warning',
                    'message' => 'dirExist',
                ],
            ];
        }

        Storage::disk($disk)->makeDirectory($directoryName);
        $directoryProperties = $this->directoryProperties(
            $disk,
            $directoryName
        );

        // add directory properties for the tree module
        $tree          = $directoryProperties;
        $tree['props'] = ['hasSubdirectories' => false];

        return [
            'result'    => [
                'status'  => 'success',
                'message' => 'dirCreated',
            ],
            'directory' => $directoryProperties,
            'tree'      => [$tree],
        ];
    }

    /**
     * Create new file
     *
     * @param $disk
     * @param $path
     * @param $name
     *
     * @return array
     */
    public function createFile($disk, $path, $name): array
    {
        $path = $this->newPath($path, $name);

        if (Storage::disk($disk)->exists($path)) {
            return [
                'result' => [
                    'status'  => 'warning',
                    'message' => 'fileExist',
                ],
            ];
        }

        Storage::disk($disk)->put($path, '');
        $fileProperties = $this->fileProperties($disk, $path);

        return [
            'result' => [
                'status'  => 'success',
                'message' => 'fileCreated',
            ],
            'file'   => $fileProperties,
        ];
    }

    /**
     * Update file
     *
     * @param $disk
     * @param $path
     * @param $file
     *
     * @return array
     */
    public function updateFile($disk, $path, $file): array
    {
        Storage::disk($disk)->putFileAs(
            $path,
            $file,
            $file->getClientOriginalName()
        );

        $filePath       = $this->newPath($path, $file->getClientOriginalName());
        $fileProperties = $this->fileProperties($disk, $filePath);

        return [
            'result' => [
                'status'  => 'success',
                'message' => 'fileUpdated',
            ],
            'file'   => $fileProperties,
        ];
    }

    /**
     * Stream file - for audio and video
     *
     * @param $disk
     * @param $path
     *
     * @return StreamedResponse
     */
    public function streamFile($disk, $path): StreamedResponse
    {
        // if file name not in ASCII format
        if (!preg_match('/^[\x20-\x7e]*$/', basename($path))) {
            $filename = Str::ascii(basename($path));
        } else {
            $filename = basename($path);
        }

        return Storage::disk($disk)->response($path, $filename, ['Accept-Ranges' => 'bytes']);
    }
}
