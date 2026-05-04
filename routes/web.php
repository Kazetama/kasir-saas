<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\CategoryController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified', 'redirect.usertype'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth/admin.php';
