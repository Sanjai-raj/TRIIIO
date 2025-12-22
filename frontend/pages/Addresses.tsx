import React, { useState, useEffect } from 'react';
import { api, handleApiError } from '../src/api/client';
import { Address } from '../types';
import { useToast } from '../context/ToastContext';
import AnimatedButton from '../components/AnimatedButton';

const initialForm: Partial<Address> = {
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
};

export default function Addresses() {
    const { showToast } = useToast();
    const [form, setForm] = useState<Partial<Address>>(initialForm);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState("");

    // Edit Mode State
    const [editingId, setEditingId] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const { data } = await api.get('/users/addresses');
            setAddresses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const searchAddress = async (q: string) => {
        setSearch(q);
        if (q.length < 3) return;

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`);
            const data = await res.json();
            setResults(data);
        } catch (e) {
            console.error("OSM Error", e);
        }
    };

    const selectAddress = (r: any) => {
        const addr = r.address;
        setForm({
            ...form,
            addressLine1: r.display_name.split(',')[0],
            addressLine2: r.display_name.split(',').slice(1, 3).join(', ').trim(),
            city: addr.city || addr.town || addr.village || addr.county || '',
            state: addr.state || '',
            pincode: addr.postcode || '',
            country: addr.country || 'India'
        });
        setResults([]);
        setSearch("");
    };

    const saveAddress = async () => {
        if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode) {
            return setError("Please fill all required fields");
        }

        try {
            if (editingId) {
                await api.put(`/users/addresses/${editingId}`, form);
                showToast("Address updated successfully", 'success');
            } else {
                await api.post('/users/addresses', form);
                showToast("Address added successfully", 'success');
            }

            setForm(initialForm);
            setEditingId(null);
            setShowForm(false);
            setResults([]);
            setSearch("");
            setError("");
            loadAddresses();
        } catch (e: any) {
            setError(handleApiError(e));
        }
    };

    const deleteAddress = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await api.delete(`/users/addresses/${id}`);
            loadAddresses();
            showToast("Address deleted", 'success');
        } catch (e: any) {
            showToast(handleApiError(e), 'error');
        }
    };

    const startEdit = (addr: Address) => {
        setForm(addr);
        setEditingId(addr._id || null);
        setShowForm(true);
        // Scroll to form if needed, but since it's below, maybe scroll to bottom?
        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    };

    const cancelEdit = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                My Addresses
            </h2>

            {/* SAVED ADDRESSES (moved to top) */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {addresses.length === 0 && !showForm && (
                    <div className="text-gray-400 italic col-span-2 text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No addresses found. Add a new one below.
                    </div>
                )}
                {addresses.map((addr) => (
                    <div
                        key={addr._id}
                        className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition relative group"
                    >
                        {addr.isDefault && (
                            <span className="absolute top-4 right-4 text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-1 rounded border border-teal-100 uppercase tracking-wider">
                                Default
                            </span>
                        )}
                        <p className="font-bold text-gray-900 text-lg mb-1">{addr.fullName}</p>
                        <p className="text-sm text-gray-500 font-medium mb-4">{addr.phone}</p>

                        <div className="text-gray-600 text-sm space-y-1">
                            <p>{addr.addressLine1}</p>
                            {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                            <p>
                                {addr.city}, {addr.state} - <span className="font-semibold text-gray-800">{addr.pincode}</span>
                            </p>
                            <p className="text-gray-400 text-xs">{addr.country}</p>
                        </div>

                        <div className="flex gap-4 mt-4 text-sm font-medium pt-4 border-t border-gray-50">
                            <button
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                onClick={() => startEdit(addr)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                                onClick={() => addr._id && deleteAddress(addr._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD NEW BUTTON */}
            {!showForm && (
                <div className="text-center">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#008B9E] text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-[#006D7C] transition shadow-lg"
                    >
                        + Add New Address
                    </button>
                </div>
            )}

            {/* FORM SECTION (Conditional) */}
            {(showForm || editingId) && (
                <div className="mt-8 border-t border-gray-100 pt-8 animate-fade-in-up">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">
                        {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>

                    {/* OPTIONAL SEARCH */}
                    <div className="mb-6 relative">
                        <input
                            value={search}
                            onChange={(e) => searchAddress(e.target.value)}
                            placeholder="Search area or city (optional - OpenStreetMap)"
                            className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        {results.length > 0 && (
                            <div className="absolute z-10 w-full border rounded mt-2 max-h-60 overflow-auto bg-white shadow-lg">
                                {results.map((r) => (
                                    <div
                                        key={r.place_id}
                                        className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50 text-gray-700"
                                        onClick={() => selectAddress(r)}
                                    >
                                        {r.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FORM INPUTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-8 rounded-lg shadow-md border border-gray-100 relative">
                        {editingId && (
                            <div className="absolute top-4 right-4 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">EDITING MODE</div>
                        )}

                        <input
                            placeholder="Full Name *"
                            className="input"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                        <input
                            placeholder="Phone Number *"
                            className="input"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            maxLength={10}
                        />
                        <input
                            placeholder="Address Line 1 *"
                            className="input md:col-span-2"
                            value={form.addressLine1}
                            onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                        />
                        <input
                            placeholder="Address Line 2 (Optional)"
                            className="input md:col-span-2"
                            value={form.addressLine2}
                            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                        />
                        <input
                            placeholder="City *"
                            className="input"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                        <input
                            placeholder="State *"
                            className="input"
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                        />
                        <input
                            placeholder="Pincode *"
                            className="input"
                            value={form.pincode}
                            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                            maxLength={6}
                        />
                        <input
                            placeholder="Country *"
                            className="input"
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                        />

                        <label className="flex items-center gap-2 md:col-span-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.isDefault || false}
                                onChange={(e) =>
                                    setForm({ ...form, isDefault: e.target.checked })
                                }
                                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                            />
                            <span className="text-gray-700 font-medium">Make this my default address</span>
                        </label>

                        {error && <p className="text-red-500 text-sm md:col-span-2 font-bold">{error}</p>}

                        <div className="md:col-span-2 flex gap-3">
                            <AnimatedButton
                                onClick={saveAddress}
                                className="flex-1 h-12 rounded-md font-bold shadow-sm uppercase tracking-wider text-sm w-auto"
                            >
                                {editingId ? 'Update Address' : 'Save Address'}
                            </AnimatedButton>

                            <button
                                onClick={cancelEdit}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition font-bold uppercase tracking-wider text-sm"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
