import { useState, useEffect } from "react";

import {
  getPembinaByGudep,
} from "../../services/pembinaService";

import {
  getReguByGudep,
} from "../../services/reguService";

import {
  getPesertaByGudep,
} from "../../services/pesertaService";

import {
  getProfilGudepById,
} from "../../services/profilGudepService";

import {
  getPendaftaranById,
  updatePendaftaran,
} from "../../services/pendaftaranService";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";


export default function DetailGudep() {

  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();


  // =====================================================
  // DATA DARI HALAMAN SEBELUMNYA
  // =====================================================

  const fromDashboard =
    location.state?.from === "dashboard";

  const gudepIdFromState =
    location.state?.gudepId || null;

  const sudahMendaftarFromState =
    location.state?.sudahMendaftar;


  // =====================================================
  // FUNGSI KEMBALI
  // =====================================================

  const handleKembali = () => {

    if (fromDashboard) {

      navigate("/admin/dashboard");

      return;

    }

    navigate("/admin/verifikasi-gudep");

  };


  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [profil, setProfil] = useState({});

  const [pembina, setPembina] = useState([]);

  const [regu, setRegu] = useState([]);

  const [peserta, setPeserta] = useState([]);

  const [belumMendaftar, setBelumMendaftar] =
    useState(false);

  const [catatanAdmin, setCatatanAdmin] =
    useState("");

  const [pendaftaran, setPendaftaran] =
    useState(null);


  // =====================================================
  // LOAD SEMUA DATA
  // =====================================================

  useEffect(() => {

    if (id) {

      loadData();

    }

  }, [id]);


  async function loadData() {

    try {

      setLoading(true);

      console.log("=================================");
      console.log("MULAI LOAD DETAIL GUDEP");
      console.log("ID URL:", id);
      console.log("FROM DASHBOARD:", fromDashboard);
      console.log(
        "GUDEP ID DARI STATE:",
        gudepIdFromState
      );
      console.log(
        "SUDAH MENDAFTAR DARI STATE:",
        sudahMendaftarFromState
      );
      console.log("=================================");


      // =================================================
      // 1. TENTUKAN GUDEP ID
      // =================================================

      let gudepId = null;

      let pendaftaranData = null;


      // =================================================
      // KONDISI A
      //
      // Dashboard + BELUM MENDAFTAR
      //
      // ID URL = ID PROFIL GUDEP
      // =================================================

      if (
        fromDashboard &&
        sudahMendaftarFromState === false
      ) {

        console.log(
          "MODE: DASHBOARD - BELUM MENDAFTAR"
        );

        gudepId =
          gudepIdFromState || id;

        setBelumMendaftar(true);

        setPendaftaran(null);

        setCatatanAdmin("");

      }


      // =================================================
      // KONDISI B
      //
      // Dashboard + SUDAH MENDAFTAR
      //
      // ID URL = ID PENDAFTARAN
      // =================================================

      else {

        console.log(
          "MODE: ID PENDAFTARAN"
        );

        pendaftaranData =
          await getPendaftaranById(id);


        console.log(
          "HASIL PENDAFTARAN:",
          pendaftaranData
        );


        if (!pendaftaranData) {

          throw new Error(
            "Data pendaftaran tidak ditemukan."
          );

        }


        setPendaftaran(
          pendaftaranData
        );


        setBelumMendaftar(false);


        setCatatanAdmin(
          pendaftaranData.catatan_admin || ""
        );


        gudepId =
          pendaftaranData.gudep_id;

      }


      // =================================================
      // VALIDASI GUDEP ID
      // =================================================

      if (!gudepId) {

        throw new Error(
          "ID Gudep tidak ditemukan."
        );

      }


      console.log(
        "GUDEP ID FINAL:",
        gudepId
      );


      // =================================================
      // 2. PROFIL GUDEP
      // =================================================

      console.log(
        "2. AMBIL PROFIL GUDEP..."
      );


      const profilData =
        await getProfilGudepById(
          gudepId
        );


      console.log(
        "HASIL PROFIL:",
        profilData
      );


      setProfil(
        profilData || {}
      );


      // =================================================
      // 3. PEMBINA
      // =================================================

      console.log(
        "3. AMBIL DATA PEMBINA..."
      );


      const pembinaData =
        await getPembinaByGudep(
          gudepId
        );


      console.log(
        "HASIL PEMBINA:",
        pembinaData
      );


      setPembina(
        pembinaData || []
      );


      // =================================================
      // 4. REGU
      // =================================================

      console.log(
        "4. AMBIL DATA REGU..."
      );


      const reguData =
        await getReguByGudep(
          gudepId
        );


      console.log(
        "HASIL REGU:",
        reguData
      );


      setRegu(
        reguData || []
      );


      // =================================================
      // 5. PESERTA
      // =================================================

      console.log(
        "5. AMBIL DATA PESERTA..."
      );


      const pesertaData =
        await getPesertaByGudep(
          gudepId
        );


      console.log(
        "HASIL PESERTA:",
        pesertaData
      );


      setPeserta(
        pesertaData || []
      );


      console.log("=================================");
      console.log(
        "SEMUA DATA DETAIL BERHASIL"
      );
      console.log(
        "GUDEP ID:",
        gudepId
      );
      console.log("=================================");


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "ERROR DETAIL GUDEP:"
      );

      console.error(error);

      console.error(
        "================================="
      );


      alert(
        "Gagal mengambil data: " +
        (
          error?.message ||
          "Error tidak diketahui"
        )
      );


    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // UPDATE STATUS PENDAFTARAN
  // =====================================================

  async function updateStatus(
    statusBaru
  ) {

    if (!pendaftaran?.id) {

      alert(
        "Data pendaftaran tidak ditemukan."
      );

      return;

    }


    const catatanVerifikasi =
      "Berkas data pendaftaran sudah lengkap, Selamat mengikuti perkemahan Jamran Kwarran Cikarang Utara, patuhi Tata tertib selama perkemahan berlangsung.";


    let pesan = "";


    if (
      statusBaru === "Terverifikasi"
    ) {

      pesan =
        "Apakah Anda yakin ingin menyetujui pendaftaran ini?";

    }

    else if (
      statusBaru === "Perlu Perbaikan"
    ) {

      pesan =
        "Apakah Anda ingin meminta operator melakukan perbaikan?";

    }

    else if (
      statusBaru === "Ditolak"
    ) {

      pesan =
        "Apakah Anda yakin ingin menolak pendaftaran ini?";

    }


    if (!window.confirm(pesan)) {

      return;

    }


    try {

      setSaving(true);


      let catatanFinal =
        catatanAdmin || "";


      if (
        statusBaru === "Terverifikasi"
      ) {

        catatanFinal =
          catatanVerifikasi;

        setCatatanAdmin(
          catatanVerifikasi
        );

      }


      const tanggalVerifikasi =
        new Date().toISOString();


      const hasil =
        await updatePendaftaran(
          pendaftaran.id,
          {

            status:
              statusBaru,

            tanggal_verifikasi:
              tanggalVerifikasi,

            catatan_admin:
              catatanFinal,

          }
        );


      console.log(
        "HASIL UPDATE:",
        hasil
      );


      setPendaftaran(
        prev => ({

          ...prev,

          status:
            statusBaru,

          tanggal_verifikasi:
            tanggalVerifikasi,

          catatan_admin:
            catatanFinal,

        })
      );


      if (
        statusBaru === "Terverifikasi"
      ) {

        alert(
          "✅ Pendaftaran berhasil disetujui.\n\nCatatan verifikasi otomatis telah disimpan."
        );

      }

      else if (
        statusBaru === "Perlu Perbaikan"
      ) {

        alert(
          "🟡 Pendaftaran dikembalikan untuk diperbaiki."
        );

      }

      else if (
        statusBaru === "Ditolak"
      ) {

        alert(
          "❌ Pendaftaran telah ditolak."
        );

      }


    } catch (error) {

      console.error(
        "GAGAL UPDATE STATUS:",
        error
      );


      alert(
        "Gagal mengubah status pendaftaran."
      );


    } finally {

      setSaving(false);

    }

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="p-10 text-center">

        <div className="text-xl font-semibold">

          Memuat data pendaftaran...

        </div>

      </div>

    );

  }


  // =====================================================
  // DATA TURUNAN
  // =====================================================

  const pesertaPutra =
    peserta.filter(
      item =>
        item.jk === "Putra"
    );


  const pesertaPutri =
    peserta.filter(
      item =>
        item.jk === "Putri"
    );


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-amber-700">

            Detail Pendaftaran Gugus Depan

          </h1>

          <p className="text-gray-500 mt-1">

            Pemeriksaan data pendaftaran Gugus Depan.

          </p>

        </div>


        <button
          onClick={handleKembali}
          className="
            bg-gray-600
            hover:bg-gray-700
            text-white
            px-5
            py-2
            rounded-lg
          "
        >

          ← Kembali

        </button>

      </div>


      {/* =================================================
          BLOK BELUM MENDAFTAR
      ================================================= */}

      {belumMendaftar && (

        <div
          className="
            bg-red-50
            border-2
            border-red-400
            text-red-800
            rounded-xl
            p-5
            shadow
          "
        >

          <div className="font-bold text-xl">

            🔴 GUDEP BELUM MENDAFTAR

          </div>


          <div className="mt-2">

            Gugus Depan ini belum melakukan
            pendaftaran Jambore Ranting 2026.

          </div>


          <div className="mt-2 text-sm font-semibold">

            Silakan hubungi operator Gugus Depan
            untuk melakukan pendaftaran.

          </div>

        </div>

      )}


      {/* =================================================
          PROFIL GUGUS DEPAN
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-green-700 mb-4">

          🏫 Profil Gugus Depan

        </h2>


        <table className="w-full">

          <tbody>

            <tr>

              <td className="font-semibold py-2 w-56">

                Nama Pangkalan

              </td>

              <td>

                {profil.nama_pangkalan || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Gudep Putra

              </td>

              <td>

                {profil.gudep_putra || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Gudep Putri

              </td>

              <td>

                {profil.gudep_putri || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Kwarran

              </td>

              <td>

                {profil.kwarran || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Kwarcab

              </td>

              <td>

                {profil.kwarcab || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Kabupaten

              </td>

              <td>

                {profil.kabupaten || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Provinsi

              </td>

              <td>

                {profil.provinsi || "-"}

              </td>

            </tr>


            <tr>

              <td className="font-semibold py-2">

                Alamat

              </td>

              <td>

                {profil.alamat || "-"}

              </td>

            </tr>

          </tbody>

        </table>

      </div>


      {/* =================================================
          DATA PEMBINA
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-blue-700 mb-4">

          👨‍🏫 Data Pembina

        </h2>


        <table className="w-full border">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="border p-3 w-16">
                No
              </th>

              <th className="border p-3">
                Nama Pembina
              </th>

              <th className="border p-3 w-32">
                JK
              </th>

              <th className="border p-3 w-48">
                Jabatan
              </th>

              <th className="border p-3 w-48">
                No. HP
              </th>

            </tr>

          </thead>


          <tbody>

            {pembina.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-5"
                >

                  Belum ada data pembina

                </td>

              </tr>

            ) : (

              pembina.map(
                (item, index) => (

                  <tr
                    key={
                      item.id ||
                      index
                    }
                  >

                    <td className="border p-3 text-center">

                      {index + 1}

                    </td>

                    <td className="border p-3">

                      {item.nama || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.jk || "-"}

                    </td>

                    <td className="border p-3">

                      {item.jabatan || "-"}

                    </td>

                    <td className="border p-3">

                      {item.hp || "-"}

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          DATA REGU
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-orange-700 mb-4">

          🏕 Data Regu

        </h2>


        <table className="w-full border">

          <thead className="bg-orange-600 text-white">

            <tr>

              <th className="border p-3 w-16">
                No
              </th>

              <th className="border p-3">
                Nama Regu
              </th>

              <th className="border p-3 w-40">
                Jenis
              </th>

              <th className="border p-3 w-48">
                Jumlah Anggota
              </th>

            </tr>

          </thead>


          <tbody>

            {regu.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="text-center p-5"
                >

                  Belum ada data regu

                </td>

              </tr>

            ) : (

              regu.map(
                (item, index) => {

                  const jumlahAnggota =
                    peserta.filter(
                      p =>
                        p.regu ===
                        item.nama
                    ).length;


                  return (

                    <tr
                      key={
                        item.id ||
                        index
                      }
                    >

                      <td className="border p-3 text-center">

                        {index + 1}

                      </td>

                      <td className="border p-3">

                        {item.nama || "-"}

                      </td>

                      <td className="border p-3 text-center">

                        {item.jenis || "-"}

                      </td>

                      <td className="border p-3 text-center">

                        {jumlahAnggota}

                      </td>

                    </tr>

                  );

                }

              )

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          PESERTA PUTRA
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-blue-700 mb-4">

          👦 Data Peserta Putra

        </h2>


        <table className="w-full border">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="border p-3 w-16">
                No
              </th>

              <th className="border p-3">
                Nama Peserta
              </th>

              <th className="border p-3 w-24">
                Kelas
              </th>

              <th className="border p-3 w-40">
                Regu
              </th>

              <th className="border p-3 w-32">
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {pesertaPutra.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-5"
                >

                  Belum ada peserta putra

                </td>

              </tr>

            ) : (

              pesertaPutra.map(
                (item, index) => (

                  <tr
                    key={
                      item.id ||
                      index
                    }
                  >

                    <td className="border p-3 text-center">

                      {index + 1}

                    </td>

                    <td className="border p-3">

                      {item.nama || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.kelas || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.regu || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.status || "-"}

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          PESERTA PUTRI
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-pink-700 mb-4">

          👧 Data Peserta Putri

        </h2>


        <table className="w-full border">

          <thead className="bg-pink-600 text-white">

            <tr>

              <th className="border p-3 w-16">
                No
              </th>

              <th className="border p-3">
                Nama Peserta
              </th>

              <th className="border p-3 w-24">
                Kelas
              </th>

              <th className="border p-3 w-40">
                Regu
              </th>

              <th className="border p-3 w-32">
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {pesertaPutri.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-5"
                >

                  Belum ada peserta putri

                </td>

              </tr>

            ) : (

              pesertaPutri.map(
                (item, index) => (

                  <tr
                    key={
                      item.id ||
                      index
                    }
                  >

                    <td className="border p-3 text-center">

                      {index + 1}

                    </td>

                    <td className="border p-3">

                      {item.nama || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.kelas || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.regu || "-"}

                    </td>

                    <td className="border p-3 text-center">

                      {item.status || "-"}

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          CATATAN ADMIN
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <label className="font-semibold block mb-2">

          Catatan Admin

        </label>


        <textarea
          rows={4}
          value={catatanAdmin}
          onChange={
            e =>
              setCatatanAdmin(
                e.target.value
              )
          }
          placeholder="Tuliskan catatan untuk operator..."
          className="w-full border rounded-lg p-3"
        />

      </div>


      {/* =================================================
          STATUS PENDAFTARAN
      ================================================= */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-green-700 mb-5">

          STATUS VERIFIKASI PENDAFTARAN

        </h2>


        <p className="mb-3">

          Nama Gudep :

          <span className="font-semibold ml-2">

            {profil.nama_pangkalan || "-"}

          </span>

        </p>


        <p className="mb-3">

          Tanggal Verifikasi :

          <span className="font-semibold ml-2">

            {pendaftaran?.tanggal_verifikasi
              ? new Date(
                  pendaftaran.tanggal_verifikasi
                ).toLocaleDateString(
                  "id-ID"
                )
              : "-"
            }

          </span>

        </p>


        <p className="mb-3">

          Status :

          <span className="font-semibold ml-2">

            {pendaftaran?.status ||
              "Belum Mendaftar"}

          </span>

        </p>


        <p>

          Catatan Panitia :

          <span className="font-semibold ml-2">

            {pendaftaran?.catatan_admin ||
              "Belum ada catatan."}

          </span>

        </p>

      </div>


      {/* =================================================
          TOMBOL VERIFIKASI
          HANYA UNTUK YANG SUDAH MENDAFTAR
      ================================================= */}

      {!belumMendaftar && pendaftaran && (

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold text-red-700 mb-5">

            ✅ Verifikasi Pendaftaran

          </h2>


          <div className="flex gap-4 flex-wrap">


            <button
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Terverifikasi"
                )
              }
              className="
                bg-green-600
                hover:bg-green-700
                disabled:bg-gray-400
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >

              ✅ Setujui

            </button>


            <button
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Perlu Perbaikan"
                )
              }
              className="
                bg-yellow-500
                hover:bg-yellow-600
                disabled:bg-gray-400
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >

              🔄 Minta Perbaikan

            </button>


            <button
              disabled={saving}
              onClick={() =>
                updateStatus(
                  "Ditolak"
                )
              }
              className="
                bg-red-600
                hover:bg-red-700
                disabled:bg-gray-400
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >

              ❌ Tolak

            </button>


          </div>


          {saving && (

            <p className="mt-4 text-gray-500">

              Menyimpan perubahan...

            </p>

          )}

        </div>

      )}

    </div>

  );

}