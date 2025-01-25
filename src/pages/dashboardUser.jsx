import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardUser = () => {
  const [komikList, setKomikList] = useState([]);
  const [komentarList, setKomentarList] = useState([]);
  const [komentar, setKomentar] = useState("");
  const [komikId, setKomikId] = useState("");
  const [editId, setEditId] = useState(null);
  const [keranjang, setKeranjang] = useState([]);
  const [bearerToken, setBearerToken] = useState(
    localStorage.getItem("token") || ""
  );

  const navigate = useNavigate();

  // Fetch data komik
  const fetchKomik = async () => {
    try {
      const response = await axios.get(
        "https://uasbackend-production.up.railway.app/komik/",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setKomikList(response.data);
    } catch (error) {
      console.error("Error fetching komik:", error);
    }
  };

  // Fetch data komentar
  const fetchKomentar = async () => {
    try {
      const response = await axios.get(
        "https://uasbackend-production.up.railway.app/comments/",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setKomentarList(response.data);
    } catch (error) {
      console.error("Error fetching komentar:", error);
    }
  };

  // Tambah/Edit komentar
  const saveKomentar = async () => {
    if (!komentar.trim()) {
      alert("Komentar tidak boleh kosong!");
      return;
    }

    try {
      const newKomentar = {
        komentar,
        komik_id: parseInt(komikId),
      };

      if (editId) {
        await axios.put(
          `https://uasbackend-production.up.railway.app/comments/${editId}`,
          newKomentar,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        console.log("Komentar berhasil diperbarui.");
      } else {
        await axios.post(
          "https://uasbackend-production.up.railway.app/comments/",
          newKomentar,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        console.log("Komentar berhasil ditambahkan.");
      }

      resetForm();
      fetchKomentar();
    } catch (error) {
      console.error(
        "Error saving komentar:",
        error.response?.data || error.message
      );
    }
  };

  // Hapus komentar
  const deleteKomentar = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      console.log("Komentar berhasil dihapus.");
      fetchKomentar();
    } catch (error) {
      console.error("Error deleting komentar:", error);
    }
  };

  const confirmDeleteKomentar = (id) => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin menghapus komentar ini?"
    );
    if (confirm) {
      deleteKomentar(id);
    }
  };

  // Edit komentar
  const editKomentar = (komentar) => {
    setKomentar(komentar.komentar);
    setKomikId(komentar.komik_id);
    setEditId(komentar.id);
  };

  // Tambah barang ke keranjang
  const tambahBarang = (komik) => {
    if (komik.stok > 0) {
      setKeranjang((prev) => [...prev, komik]);
      setKomikList((prev) =>
        prev.map((item) =>
          item.id === komik.id ? { ...item, stok: item.stok - 1 } : item
        )
      );
    }
  };

  // Kurang barang dari keranjang
  const kurangBarang = (komik) => {
    const index = keranjang.findIndex((item) => item.id === komik.id);
    if (index !== -1) {
      const updatedKeranjang = [...keranjang];
      updatedKeranjang.splice(index, 1);
      setKeranjang(updatedKeranjang);
      setKomikList((prev) =>
        prev.map((item) =>
          item.id === komik.id ? { ...item, stok: item.stok + 1 } : item
        )
      );
    }
  };

  // Reset form komentar
  const resetForm = () => {
    setKomentar("");
    setKomikId("");
    setEditId(null);
  };

  useEffect(() => {
    fetchKomik();
    fetchKomentar();
  }, [bearerToken]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Form Tambah/Edit Komentar */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <textarea
          className="border p-2 col-span-3"
          placeholder="Komentar"
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
        />
        <select
          className="border p-2"
          value={komikId}
          onChange={(e) => setKomikId(e.target.value)}
        >
          <option value="">Pilih Komik</option>
          {komikList.map((komik) => (
            <option key={komik.id} value={komik.id}>
              {komik.nama}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={saveKomentar}
        className={`${editId ? "bg-yellow-500" : "bg-blue-500"} text-white px-4 py-2 rounded`}
      >
        {editId ? "Update" : "Submit"}
      </button>
      {editId && (
        <button
          onClick={resetForm}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      )}

      {/* Daftar Komik */}
      <h2 className="text-xl font-bold mt-6">Daftar Komik</h2>
      <table className="table-auto w-full mt-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Nama</th>
            <th className="border border-gray-400 px-4 py-2">Author</th>
            <th className="border border-gray-400 px-4 py-2">Genre</th>
            <th className="border border-gray-400 px-4 py-2">Tahun Terbit</th>
            <th className="border border-gray-400 px-4 py-2">Publisher</th>
            <th className="border border-gray-400 px-4 py-2">Stok</th>
            <th className="border border-gray-400 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {komikList.map((komik) => (
            <tr key={komik.id}>
              <td className="border border-gray-400 px-4 py-2">{komik.nama}</td>
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
              <td className="border border-gray-400 px-4 py-2">{komik.stok}</td>
              <td className="border border-gray-400 px-4 py-2">
                <button
                  onClick={() => tambahBarang(komik)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Tambah
                </button>
                <button
                  onClick={() => kurangBarang(komik)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Kurang
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tombol Checkout */}
      <button
        onClick={() => navigate("/checkout", { state: { keranjang } })}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>

      {/* Daftar Komentar */}
      <h2 className="text-xl font-bold mt-6">Daftar Komentar</h2>
      <table className="table-auto w-full mt-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Komentar</th>
            <th className="border border-gray-400 px-4 py-2">Komik</th>
            <th className="border border-gray-400 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {komentarList.map((komentar) => (
            <tr key={komentar.id}>
              <td className="border border-gray-400 px-4 py-2">
                {komentar.komentar}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {komikList.find((komik) => komik.id === komentar.komik_id)
                  ?.nama || "Tidak ditemukan"}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <button
                  onClick={() => editKomentar(komentar)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteKomentar(komentar.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardUser;
