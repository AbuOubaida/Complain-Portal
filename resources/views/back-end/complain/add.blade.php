@extends('layouts.back-end.main')
@section('mainContent')
    <div class="container-fluid px-4">
        <a href="{{\Illuminate\Support\Facades\URL::previous()}}" class="btn btn-danger btn-sm"><i class="fas fa-chevron-left"></i> Go Back</a>
        <h1 class="mt-4">{{str_replace('-', ' ', config('app.name'))}}</h1>
        <div class="row">
            <div class="col-md-10">
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item">
                        <a href="{{route('dashboard')}}" class="text-capitalize text-chl">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a style="text-decoration: none;" href="#" class="text-capitalize">{{str_replace('.', ' ', \Route::currentRouteName())}}</a>
                    </li>
                </ol>
            </div>
            <div class="col-md-2">
                <div class="float-end">
                    <a class="btn btn-success btn-sm" href="{{route('my.list.complain')}}"><i class="fas fa-list-check"></i>  My List</a>
                </div>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-body">
                <div class="row">
                    <h3 class="text-capitalize">{{str_replace('.', ' ', \Route::currentRouteName())}}</h3>
                </div>
                <form action="{{ route('add.complain') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-floating mb-3">
                                <input class="form-control" id="complain_title" name="complain_title" type="text" placeholder="Enter complain title" value="{{old('complain_title')}}"/>
                                <label for="complain_title">Complain Title <span class="text-danger">*</span></label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-floating mb-3">
                                <select class="form-control text-capitalize" id="priority" name="priority">
                            @if(count($priorities))
                                @foreach($priorities as $priority)
                                    <option class="text-capitalize" value="{{$priority->priority_number}}" @if($priority->id == old('priority')) selected @endif>{{$priority->title}}</option>
                                @endforeach

                            @endif
                                </select>
                                <label for="priority">Complain Priority</label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-floating mb-3">
                                <select class="form-control" id="to" name="to">
                                    <option value=""></option>
                            @if(count($depts))
                                @foreach($depts as $d)
                                    <option class="text-capitalize" value="{{$d->id}}" @if($d->id == old('to')) selected @endif>{{$d->dept_name}}</option>
                                @endforeach

                            @endif
                                </select>
                                <label for="priority">To Department <span class="text-danger">*</span></label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-floating mb-3">
                                <textarea name="content" id="editor" cols="50">{{old('content')}}</textarea>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-floating mb-3 float-end">
                                <input type="submit" value="Submit Complain" class="btn btn-chl-outline" name="submit" >
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop

