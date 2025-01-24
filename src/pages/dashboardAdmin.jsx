import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardAdmin = () => {
  const [komikList, setKomikList] = useState([]);
  const [komentarList, setKomentarList] = useState([]);
  const [nama, setNama] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [publisher, setPublisher] = useState("");
  const [stok, setStok] = useState("");
  const [editId, setEditId] = useState(null);
  const [bearerToken, setBearerToken] = useState(
    localStorage.getItem("token") || ""
  );

  // Fetch data komik
  const fetchKomik = async () => {
    try {
      const response = await axios.get("http://localhost:8081/komik/", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      setKomikList(response.data);
    } catch (error) {
      console.error("Error fetching komik:", error);
    }
  };

  // Fetch data komentar
  const fetchKomentar = async () => {
    try {
      const response = await axios.get("http://localhost:8081/comments/", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      setKomentarList(response.data);
    } catch (error) {
      console.error("Error fetching komentar:", error);
    }
  };

  // Tambah/Edit komik
  const saveKomik = async () => {
    try {
      const newKomik = {
        nama,
        author,
        genre,
        tahun_terbit: parseInt(tahunTerbit),
        publisher,
        stok: parseInt(stok),
      };

      if (editId) {
        await axios.put(`http://localhost:8081/komik/${editId}`, newKomik, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        console.log("Komik berhasil diperbarui.");
      } else {
        await axios.post("http://localhost:8081/komik/", newKomik, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        console.log("Komik berhasil ditambahkan.");
      }

      resetForm();
      fetchKomik();
    } catch (error) {
      console.error(
        "Error saving komik:",
        error.response?.data || error.message
      );
    }
  };

  // Hapus komik
  const deleteKomik = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/komik/${id}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      console.log("Komik berhasil dihapus.");
      fetchKomik();
    } catch (error) {
      console.error("Error deleting komik:", error);
    }
  };

  // Hapus komentar
  const deleteKomentar = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/comments/${id}`, {
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

  // Edit komik
  const editKomik = (komik) => {
    setNama(komik.nama);
    setAuthor(komik.author);
    setGenre(komik.genre);
    setTahunTerbit(komik.tahun_terbit);
    setPublisher(komik.publisher);
    setStok(komik.stok);
    setEditId(komik.id);
  };

  const resetForm = () => {
    setNama("");
    setAuthor("");
    setGenre("");
    setTahunTerbit("");
    setPublisher("");
    setStok("");
    setEditId(null);
  };

  useEffect(() => {
    fetchKomik();
    fetchKomentar();
  }, [bearerToken]);

  const confirmDeleteKomik = (id) => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin menghapus komik ini?"
    );
    if (confirm) {
      deleteKomik(id);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Form Tambah/Edit Komik */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        <input
          type="text"
          className="border p-2"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          type="text"
          className="border p-2"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          className="border p-2"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="number"
          className="border p-2"
          placeholder="Tahun Terbit"
          value={tahunTerbit}
          onChange={(e) => setTahunTerbit(e.target.value)}
        />
        <input
          type="text"
          className="border p-2"
          placeholder="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />
        <input
          type="number"
          className="border p-2"
          placeholder="Stok"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
        />
      </div>
      <button
        onClick={saveKomik}
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
                  onClick={() => editKomik(komik)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteKomik(komik.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Daftar Komentar */}
      <h2 className="text-xl font-bold mt-6">Daftar Komentar</h2>
      <table className="table-auto w-full mt-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Komentar</th>
            <th className="border border-gray-400 px-4 py-2">Pengguna</th>
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
                {komentar.user_id}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <button
                  onClick={() => confirmDeleteKomentar(komentar.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
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

export default DashboardAdmin;
