<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectUsertype
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $dashboards = [
            'admin'      => 'admin.dashboard',
            'user'       => 'dashboard',
        ];

        $usertype = $user->usertype;

        if (! isset($dashboards[$usertype])) {
            if ($request->routeIs('dashboard')) {
                return $next($request);
            }
            return redirect()->route('dashboard');
        }

        $targetRoute = $dashboards[$usertype];

        $restrictedPaths = match ($usertype) {
            'admin' => ['dashboard'],
            default => [],
        };

        foreach ($restrictedPaths as $path) {
            if ($request->is($path)) {
                if ($request->routeIs($targetRoute)) {
                    break;
                }
                return redirect()->route($targetRoute);
            }
        }

        return $next($request);
    }
}
