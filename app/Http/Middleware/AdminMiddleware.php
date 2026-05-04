<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Jika user adalah admin, izinkan lanjut
        if (Auth::check() && $request->user()->isAdmin()) {
            return $next($request);
        }

        $user = Auth::user();

        // 1. Tentukan URL tujuan berdasarkan usertype
        $redirectUrl = match ($user?->usertype) {
            'user' => url('/dashboard'),
            default => url('/login'),
        };

        // 2. Kembalikan response HTML dengan UI Putih Bersih
        return response("
            <!DOCTYPE html>
            <html lang='id'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <meta http-equiv='refresh' content='5;url=$redirectUrl' />
                    <title>Akses Ditolak</title>
                    <script src='https://cdn.tailwindcss.com'></script>
                </head>
                <body class='bg-gray-50 text-slate-900 flex items-center justify-center min-h-screen font-sans antialiased'>
                    <div class='w-full max-w-md p-10 bg-white border border-gray-200 rounded-xl shadow-sm text-center'>
                        <div class='mb-6 flex justify-center'>
                            <div class='p-3 bg-red-50 rounded-full'>
                                <svg class='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                                </svg>
                            </div>
                        </div>

                        <h1 class='text-xl font-semibold text-gray-900 mb-2'>Akses Dibatasi</h1>
                        <p class='text-gray-500 text-sm mb-8'>Maaf, Tama. Akun kamu tidak memiliki izin untuk mengakses halaman manajemen ini.</p>

                        <div class='pt-6 border-t border-gray-100'>
                            <p class='text-xs text-gray-400'>
                                Kembali ke dashboard dalam <span id='timer' class='font-medium text-blue-600'>5</span> detik...
                            </p>
                        </div>
                    </div>

                    <script>
                        let count = 5;
                        const timerDisplay = document.getElementById('timer');
                        const interval = setInterval(() => {
                            count--;
                            if(count >= 0) {
                                timerDisplay.innerText = count;
                            } else {
                                clearInterval(interval);
                            }
                        }, 1000);
                    </script>
                </body>
            </html>
        ", 403);
    }
}
