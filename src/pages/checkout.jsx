import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { keranjang } = location.state || { keranjang: [] };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Menghitung jumlah barang berdasarkan ID komik
  const jumlahBarang = keranjang.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});

  // Membuat daftar unik komik dengan jumlahnya
  const uniqueKeranjang = Object.values(
    keranjang.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, jumlah: jumlahBarang[item.id] };
      }
      return acc;
    }, {})
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {uniqueKeranjang.length > 0 ? (
        <table className="table-auto w-full mt-4 border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">Nama</th>
              <th className="border border-gray-400 px-4 py-2">Author</th>
              <th className="border border-gray-400 px-4 py-2">Genre</th>
              <th className="border border-gray-400 px-4 py-2">Tahun Terbit</th>
              <th className="border border-gray-400 px-4 py-2">Publisher</th>
              <th className="border border-gray-400 px-4 py-2">
                Jumlah Barang
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueKeranjang.map((komik, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2">
                  {komik.nama}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {komik.author}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {komik.genre}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {komik.tahun_terbit}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {komik.publisher}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {komik.jumlah}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">
          Keranjang kosong. Tambahkan barang terlebih dahulu.
        </p>
      )}

      <button
        onClick={handleBack}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Kembali
      </button>
    </div>
  );
};

export default CheckoutPage;
