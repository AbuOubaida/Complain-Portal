@extends('layouts.back-end.main')
@section('mainContent')
<div class="container-fluid px-4">
    <h1 class="mt- text-capitalize">{{str_replace('-', ' ', config('app.name'))}} | {{str_replace('.', ' ', \Route::currentRouteName())}} Page</h1>
    <ol class="breadcrumb mb-4">
        <li class="breadcrumb-item">
            <a href="{{route('dashboard')}}" class="text-capitalize text-chl">Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a style="text-decoration: none;" href="#" class="text-capitalize">{{str_replace('.', ' ', \Route::currentRouteName())}}</a>
        </li>
    </ol>
    <div class="row">
        <div class="col-md-7">
            <div class="card mb-4">
                <div class="card-body">
                    <h5># Add New Company</h5>
                    <hr>
                    <form action="{!! route('add.company') !!}" method="POST">
                        @csrf
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-floating mb-">
                                    <input type="text" class="form-control" id="company-name" name="company_name" required="required" placeholder="Company Name">
                                    <label for="company-name">Company Name<span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating mb-">
                                    <input type="text" class="form-control" id="company-short-name" name="company_short_name" required="required" placeholder="Company Short Name">
                                    <label for="company-short-name">Company Short Name<span class="text-danger">*</span></label>
                                </div>
                                <small><b>Note:</b> Characters are allowed only (A to Z, 0-9)</small>
                            </div>


                            <div class="col-md-3">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="permission_display_name" name="permission_display_name" type="text" placeholder="Enter Permission Display Name" value="{{old('permission_display_name')}}" required/>
                                    <label for="permission_display_name">Display Name<span class="text-danger">*</span></label>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="form-floating mb-3">
                                    <textarea class="form-control" id="description" name="description"> {!! old('description') !!}</textarea>
                                    <label for="remarks">Description</label>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-floating mb-3 float-end">
                                    <input type="submit" value="Add" class="btn btn-chl-outline" name="submit" >
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="card mb-4">
                <div class="card-body">
                    <h5># Add New Company Type</h5>
                    <hr>
                    <form action="{!! route('add.company.type') !!}" method="POST">
                        @csrf
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="company-type-title" name="company_type_title" required="required" placeholder="Company Name" value="{!! old('company_type_title') !!}">
                                    <label for="company-type-title">Company Type Title<span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select name="company_type_status" id="company_type_status" class="form-control">
                                        <option value="1" @if(old('company_type_status') == 1) selected @endif>Active</option>
                                        <option value="0" @if(old('company_type_status') == 0) selected @endif>Inactive</option>
                                    </select>
                                    <label for="company_type_status">Company Type Status<span class="text-danger">*</span></label>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <textarea class="form-control" id="description" name="description"> {!! old('description') !!}</textarea>
                                    <label for="remarks">Description</label>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-floating mb-3 float-end">
                                    <input type="submit" value="Add Type" class="btn btn-chl-outline" name="submit" >
                                </div>
                            </div>
                        </div>
                    </form>
                    <h5># Company Type list</h5>
                    <hr>
                    @include("back-end.programmer._company-type-edit-list")
                </div>
            </div>
        </div>
    </div>

</div>
@stop

