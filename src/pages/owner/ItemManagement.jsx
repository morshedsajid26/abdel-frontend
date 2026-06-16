import React, { useState } from "react";
import { Trash2, X } from "lucide-react";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";

const ItemManagement = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleDeleteClick = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Logic to delete the item (mock for now)
    console.log("Deleting item:", deletingItem);
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };
  const columns = [
    { key: "category", Title: "Category", width: "20%" },
    { key: "name", Title: "Name", width: "20%" },
    { key: "unit", Title: "Unit", width: "20%" },
    { key: "price", Title: "Price", width: "10%" },
    {
      key: "action",
      Title: "Action",
      width: "15%",
      sortable: false,
      render: (row) => (
        <div className="flex justify-center">
          <button 
            onClick={() => handleDeleteClick(row)}
            className="text-red-500/70 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },

  ];

  const items = [
    { category: "Beverage", name: "Fanta", unit: "L", price: "$230" },
    { category: "Beverage", name: "Coca cola", unit: "L", price: "$437" },
    { category: "Grocery", name: "Pizza", unit: "1 pc", price: "$674" },
    { category: "Beverage", name: "Pepsi", unit: "L", price: "$987" },
    { category: "Beverage", name: "Mojo", unit: "L", price: "$123" },
    { category: "Grocery", name: "Burger", unit: "1 pc", price: "$327" },
  ];

  return (
    <div >
      <Breadcrumb text="You can see your item management" />
      
      <div className="bg-[#ffffff] border border-[#e6e4df] rounded-2xl overflow-hidden shadow-sm">
        <Table
          TableHeads={columns}
          TableRows={items}
          headClass=" border-b border-[#e6e4df] text-[#0e1217] whitespace-nowrap last:[&>div]:justify-center"
          tableClass="border-none"
        />

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[500px] p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[#0e1217] text-xl font-bold mb-3 text-center">Are you absolutely sure?</h2>
            <p className="text-[#9fa5ac] text-[14px] leading-relaxed mb-10 text-center px-4">
              This action cannot be undone. This will permanently delete the item <span className="text-[#0e1217] font-semibold">{deletingItem?.name}</span> and remove it from your inventory.
            </p>

            <div className="flex items-center justify-center gap-5">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-[#ffffff] text-black font-semibold px-10 py-2.5 rounded-full hover:bg-[#e6e4df] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="bg-[#ef4444] text-[#0e1217] px-10 py-2.5 rounded-full font-semibold hover:bg-red-600 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemManagement;
