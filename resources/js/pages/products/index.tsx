import { Head, useForm, router } from '@inertiajs/react';
import { Trash2, Edit, Search, Plus, Package, Image as ImageIcon } from 'lucide-react';
import type { FormEventHandler} from 'react';
import { useState, useMemo } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    unit_id: number;
    name: string;
    sku: string | null;
    cost_price: string | number;
    price: string | number;
    stock: number;
    image: string | null;
    image_url: string | null;
    category: Category;
    unit: Unit;
}

interface Props {
    products: Product[];
    categories: Category[];
    units: Unit[];
    filters: {
        search: string;
    };
}

export default function Products({ products, categories, units, filters }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        unit_id: '',
        name: '',
        sku: '',
        cost_price: '',
        price: '',
        stock: '',
        image: null as File | null,
    });

    // Grouping logic
    const groupedProducts = useMemo(() => {
        const groups: Record<string, Product[]> = {};
        products.forEach(product => {
            const catName = product.category?.name || 'Tanpa Kategori';
            if (!groups[catName]) groups[catName] = [];
            groups[catName].push(product);
        });
        return groups;
    }, [products]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', { search }, { preserveState: true });
    };

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        reset();
        clearErrors();
        setEditingProduct(product);
        setData({
            category_id: product.category_id.toString(),
            unit_id: product.unit_id ? product.unit_id.toString() : '',
            name: product.name,
            sku: product.sku || '',
            cost_price: product.cost_price.toString(),
            price: product.price.toString(),
            stock: product.stock.toString(),
            image: null,
        });
        setIsEditModalOpen(true);
    };

    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();
        post('/products', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingProduct) return;
        
        // Inertia multipart upload for PUT can be tricky with some PHP versions, 
        // so we use POST with _method=PUT
        router.post(`/products/${editingProduct.id}`, {
            _method: 'PUT',
            ...data,
        }, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setEditingProduct(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(`/products/${id}`);
        }
    };

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(amount));
    };

    return (
        <>
            <Head title="Manajemen Produk" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
                        <p className="text-muted-foreground">Kelola stok dan harga barang dagangan Anda.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau SKU..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <Button onClick={openAddModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Produk
                        </Button>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                        <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <h3 className="text-lg font-medium">Belum ada produk</h3>
                        <p className="mb-4 text-sm text-muted-foreground">Mulai dengan menambahkan produk pertama Anda.</p>
                        <Button onClick={openAddModal} variant="outline">Tambah Produk</Button>
                    </div>
                ) : (
                    Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
                        <div key={categoryName} className="space-y-4">
                            <h2 className="text-lg font-semibold border-b pb-2 text-primary/80 uppercase tracking-wider">{categoryName}</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categoryProducts.map((product) => (
                                    <div key={product.id} className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                                        <div className="aspect-video relative overflow-hidden bg-muted">
                                            {product.image_url ? (
                                                <img 
                                                    src={product.image_url} 
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEditModal(product)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-2 left-2">
                                                <span className="rounded bg-black/50 px-2 py-1 text-[10px] font-bold text-white uppercase">{product.sku || 'No SKU'}</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="line-clamp-1 font-bold">{product.name}</h3>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-lg font-extrabold text-primary">{formatCurrency(product.price)}</p>
                                                <p className="text-xs text-muted-foreground">{product.stock} {product.unit?.name}</p>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground border-t pt-2">
                                                <span>Modal: {formatCurrency(product.cost_price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Modal (Reuse for Add/Edit) */}
            <Dialog 
                open={isAddModalOpen || isEditModalOpen} 
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={isEditModalOpen ? handleEdit : handleAdd}>
                        <DialogHeader>
                            <DialogTitle>{isEditModalOpen ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                            <DialogDescription>
                                Lengkapi detail informasi produk di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select 
                                        value={data.category_id} 
                                        onValueChange={(val) => setData('category_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Satuan</Label>
                                    <Select 
                                        value={data.unit_id} 
                                        onValueChange={(val) => setData('unit_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih satuan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Tanpa Satuan</SelectItem>
                                            {units.map(u => (
                                                <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.unit_id && <p className="text-xs text-red-500">{errors.unit_id}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Produk</Label>
                                    <Input 
                                        id="name" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        placeholder="Kopi Susu..."
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU (Kode Produk)</Label>
                                    <Input 
                                        id="sku" 
                                        value={data.sku} 
                                        onChange={e => setData('sku', e.target.value)} 
                                        placeholder="PRD-001"
                                    />
                                    {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cost_price">Harga Modal</Label>
                                    <Input 
                                        id="cost_price" 
                                        type="number" 
                                        value={data.cost_price} 
                                        onChange={e => setData('cost_price', e.target.value)} 
                                    />
                                    {errors.cost_price && <p className="text-xs text-red-500">{errors.cost_price}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga Jual</Label>
                                    <Input 
                                        id="price" 
                                        type="number" 
                                        value={data.price} 
                                        onChange={e => setData('price', e.target.value)} 
                                    />
                                    {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok Awal</Label>
                                    <Input 
                                        id="stock" 
                                        type="number" 
                                        value={data.stock} 
                                        onChange={e => setData('stock', e.target.value)} 
                                    />
                                    {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Foto Produk</Label>
                                <Input 
                                    id="image" 
                                    type="file" 
                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                    accept="image/*"
                                />
                                {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Produk'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Products.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '/products',
        },
        {
            title: 'Produk',
            href: '/products',
        },
    ],
};
