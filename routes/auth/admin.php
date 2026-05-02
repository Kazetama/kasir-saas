<?php

use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\AdminController::class, 'index'])->name('dashboard');
    });
