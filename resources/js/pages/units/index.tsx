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

interface Unit {
    id: number;
    name: string;
}

interface Props {
    units: Unit[];
}

export default function Units({ units }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddModalOpen(true);
    };

    const openEditModal = (unit: Unit) => {
        reset();
        clearErrors();
        setEditingUnit(unit);
        setData('name', unit.name);
        setIsEditModalOpen(true);
    };

    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();
        post('/units', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!editingUnit) {
            return;
        }
        
        put(`/units/${editingUnit.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setEditingUnit(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
            router.delete(`/units/${id}`);
        }
    };

    return (
        <>
            <Head title="Satuan Produk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Satuan Produk</h1>
                        <p className="text-muted-foreground">Kelola satuan untuk produk Anda (Pcs, Kg, Liter, dll).</p>
                    </div>
                    
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddModal}>Tambah Satuan</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleAdd}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Satuan</DialogTitle>
                                    <DialogDescription>
                                        Masukkan nama satuan baru untuk produk Anda.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Satuan</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: Pcs, Kg"
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
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Satuan</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {units.length === 0 ? (
                                    <tr className="border-b transition-colors">
                                        <td colSpan={2} className="p-8 text-center align-middle text-muted-foreground">
                                            Belum ada satuan yang ditambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    units.map((unit) => (
                                        <tr key={unit.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{unit.name}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(unit)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(unit.id)}>
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
                            <DialogTitle>Edit Satuan</DialogTitle>
                            <DialogDescription>
                                Ubah nama satuan produk Anda.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nama Satuan</Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Pcs, Kg"
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

Units.layout = {
    breadcrumbs: [
        {
            title: 'Satuan Produk',
            href: '/units',
        },
    ],
};
