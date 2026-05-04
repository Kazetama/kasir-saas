<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Unit extends Model
{
    protected $fillable = [
        'name',
        'user_id',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        // Global scope to automatically filter by the currently authenticated user
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (Auth::check()) {
                $builder->where('user_id', Auth::id());
            }
        });

        // Automatically set the user_id upon creation
        static::creating(function ($unit) {
            if (Auth::check() && empty($unit->user_id)) {
                $unit->user_id = Auth::id();
            }
        });
    }
}
