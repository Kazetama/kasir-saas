import { Head, useForm, router } from '@inertiajs/react';
import { Trash2, Edit } from 'lucide-react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[];
}

export default function Categories({ categories }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        reset();
        clearErrors();
        setEditingCategory(category);
        setData('name', category.name);
        setIsEditModalOpen(true);
    };

    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();
        post('/categories', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!editingCategory) {
return;
}
        
        put(`/categories/${editingCategory.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setEditingCategory(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/categories/${id}`);
        }
    };

    return (
        <>
            <Head title="Kategori Produk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori Produk</h1>
                        <p className="text-muted-foreground">Kelola kategori untuk produk Anda.</p>
                    </div>
                    
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddModal}>Tambah Kategori</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleAdd}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Kategori</DialogTitle>
                                    <DialogDescription>
                                        Masukkan nama kategori baru untuk produk Anda.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Kategori</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: Makanan Ringan"
                                            autoFocus
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Kategori</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {categories.length === 0 ? (
                                    <tr className="border-b transition-colors">
                                        <td colSpan={3} className="p-8 text-center align-middle text-muted-foreground">
                                            Belum ada kategori yang ditambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{category.name}</td>
                                            <td className="p-4 align-middle text-muted-foreground">{category.slug}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(category.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Kategori</DialogTitle>
                            <DialogDescription>
                                Ubah nama kategori produk Anda.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Makanan Ringan"
                                    autoFocus
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Categories.layout = {
    breadcrumbs: [
        {
            title: 'Kategori Produk',
            href: '/categories',
        },
    ],
};
