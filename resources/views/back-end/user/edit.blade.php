@extends('layouts.back-end.main')
@section('mainContent')
    <div class="container-fluid px-4">
        <a href="{{\Illuminate\Support\Facades\URL::previous()}}" class="btn btn-danger btn-sm"><i class="fas fa-chevron-left"></i> Go Back</a>
        <h1 class="mt-4">{{str_replace('-', ' ', config('app.name'))}}</h1>
        <div class="row">
            <div class="col-md-9">
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item">
                        <a href="{{route('dashboard')}}" class="text-capitalize text-chl">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a style="text-decoration: none;" href="#" class="text-capitalize">{{str_replace('.', ' ', \Route::currentRouteName())}}</a>
                    </li>
                </ol>
            </div>
            <div class="col-md-3">
                <div class="row">
                    <div class="col">
                        <a class="btn btn-success btn-sm float-end" href="{{route('add.user')}}"><i class="fa-solid fa-circle-plus"></i> Add User</a>
                    </div>
                    <div class="col">
                        <a class="btn btn-info btn-sm float-end" href="{{route('user.list')}}"><i class="fas fa-list-check"></i>  User List</a>
                    </div>
                    <div class="col">
                        <a class="btn btn-primary btn-sm float-end" href="{{route('user.single.view',['userID'=>\Illuminate\Support\Facades\Request::route('userID')])}}"><i class='fas fa-eye'></i>  User View</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-body">
                <div class="row">
                    <h3 class="text-capitalize">{{str_replace('.', ' ', \Route::currentRouteName())}}</h3>
                </div>
                <form action="{{ route('user.edit',["userID"=>\Illuminate\Support\Facades\Crypt::encryptString($user->id)]) }}" method="POST" enctype="multipart/form-data">
                    @method('put')
                    @csrf
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-floating mb-3">
                                <input class="form-control" id="name" name="name" type="text" placeholder="Enter full name" value="@if(old('name')){!! old('name') !!}@else{{$user->name}}@endif"/>
                                <label for="name">Full name <span class="text-danger">*</span></label>
                            </div>
                        </div>
                        <input type="hidden" name="id" value="{!! \Illuminate\Support\Facades\Crypt::encryptString($user->id) !!}">
                        <div class="col-md-3">
                            <div class="form-floating mb-3">
                                <input class="form-control" id="phone" name="phone" type="text" placeholder="Enter phone number" value="@if(old('phone')){!! old('phone') !!}@else{!!  str_replace('','',($user->phone))!!}@endif"/>
                                <label for="phone">Phone number <span class="text-danger">*</span></label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-floating mb-3">
                                <input class="form-control" id="email" name="email" type="email" placeholder="Enter email address" value="@if(old('email')) {!! old('email') !!} @else {{$user->email}}  @endif"/>
                                <label for="email">Email address <span class="text-danger">*</span></label>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-floating mb-3 float-end">
                                <input type="submit" value="Update User" class="btn btn-chl-outline" name="submit" >
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop

