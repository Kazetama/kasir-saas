<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('categories/index', [
            'categories' => Category::query()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Category::query()->create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $category->fill([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ])->save();

        return redirect()->back()->with('success', 'Kategori berhasil diubah.');
    }

    public function destroy(Category $category)
    {
        Category::destroy($category->id);

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
