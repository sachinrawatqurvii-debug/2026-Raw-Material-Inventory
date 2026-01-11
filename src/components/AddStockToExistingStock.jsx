import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FaBox,
    FaPlus,
    FaSpinner,
    FaCheckCircle,
    FaWarehouse,
    FaCalendarAlt,
    FaTag
} from 'react-icons/fa';
import { useGlobalContext } from './context/StockContextProvider';

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://raw-material-backend.onrender.com"

const AddStockToExistingStock = () => {
    const { meterAndKG, fetchMeterAndKgRelationShip, styleLoading } = useGlobalContext();
    const [formData, setFormData] = useState({
        fabricNumber: '',
        stockQuantity: ''
    });
    const [loading, setLoading] = useState(false);
    const [updatedStock, setUpdatedStock] = useState(null);

    useEffect(() => {
        fetchMeterAndKgRelationShip()
    }, [])

    const getFabricAverage = () => {
        if (meterAndKG.length > 0 && formData.fabricNumber?.toString().length > 3) {
            let findFabricNumber = meterAndKG.find((fab) => fab.fabric_number === Number(formData.fabricNumber));
            console.log("matching fabric number", findFabricNumber);
            return findFabricNumber?.fabric_in_meter
        }
    }



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fabricNumber || !formData.stockQuantity) {
            toast.error('Please fill all fields');
            return;
        }

        if (getFabricAverage() < 1) {
            toast.error("Unmapped relationship. Please map KG and METER first.")
            return
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `${BASE_URL}/api/v1/stock/update`,
                {
                    fabricNumber: formData.fabricNumber,
                    stockQuantity: (formData.stockQuantity) * (getFabricAverage() || 1)
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success) {
                setUpdatedStock(response.data.message);
                toast.success('Stock updated successfully!');
                setFormData({ fabricNumber: '', stockQuantity: '' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update stock';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (styleLoading) {
        return <p className='text-center mt-2 animate-pulse'>loading...</p>
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
            <div className="container grid  grid-cols-2 gap-4 mx-auto">
                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xs p-6 mb-6 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Fabric Number Input */}
                        <div>
                            <label htmlFor="fabricNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <FaTag className="text-blue-500" />
                                    Fabric Number *
                                </div>
                            </label>
                            <input
                                type="number"
                                id="fabricNumber"
                                name="fabricNumber"
                                value={formData.fabricNumber}
                                onChange={handleInputChange}
                                placeholder="Enter fabric number (e.g., 6020)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Stock Quantity Input */}
                        <div>
                            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <FaPlus className="text-green-500" />
                                    Quantity to Add * | {getFabricAverage() > 0 && (
                                        <span> 1KG = {getFabricAverage()} </span>
                                    )}
                                </div>
                            </label>
                            <input
                                type="number"
                                id="stockQuantity"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                placeholder="Enter quantity to add"
                                // min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FaSpinner className="animate-spin" />
                                    Updating Stock...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <FaPlus />
                                    Add Stock
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                {/* Success Card */}
                {updatedStock && (
                    <div className="bg-white rounded-2xl shadow-xs p-6 border border-green-200 animate-fade-in">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <FaCheckCircle className="text-green-600 text-2xl" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-center text-green-600 mb-4">
                            Stock Updated Successfully!
                        </h2>

                        <div className="space-y-4">
                            {/* Fabric Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Fabric Name</p>
                                    <p className="font-semibold text-gray-800">{updatedStock.fabricName}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Fabric Number</p>
                                    <p className="font-semibold text-gray-800">{updatedStock.fabricNumber}</p>
                                </div>
                            </div>

                            {/* Stock Quantity */}
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-green-600 mb-1">Available Stock</p>
                                        <p className="text-2xl font-bold text-green-700">
                                            {updatedStock.availableStock?.toFixed(2)} meter
                                        </p>
                                    </div>
                                    <FaBox className="text-green-500 text-2xl" />
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <FaWarehouse className="text-gray-400" />
                                    <span className="text-gray-600">Location:</span>
                                    <span className="font-medium text-gray-800">{updatedStock.location}</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Date(updatedStock.updatedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Style Numbers */}
                            {updatedStock.styleNumbers && updatedStock.styleNumbers.length > 0 && (
                                <div className="border-t pt-4 mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Style Numbers:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {updatedStock.styleNumbers.slice(0, 6).map((style, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium"
                                            >
                                                {style}
                                            </span>
                                        ))}
                                        {updatedStock.styleNumbers.length > 6 && (
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                                                +{updatedStock.styleNumbers.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default AddStockToExistingStock;