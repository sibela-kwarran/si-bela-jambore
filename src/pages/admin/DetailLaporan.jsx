import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProfilGudepById } from "../../services/profilGudepService";
import { getPembinaByGudep } from "../../services/pembinaService";
import { getReguByGudep } from "../../services/reguService";
import { getPesertaByGudep } from "../../services/pesertaService";

import { cetakLaporanGudepPDF } from "../../services/pdfService";
import html2pdf from "html2pdf.js";




export default function DetailLaporan() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [profil, setProfil] = useState({});
  const [pembina, setPembina] = useState([]);
  const [regu, setRegu] = useState([]);
  const [peserta, setPeserta] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {

    try {

      const gudepId = id;

      const profilData = await getProfilGudepById(gudepId);
      setProfil(profilData || {});

      const pembinaData = await getPembinaByGudep(gudepId);
      setPembina(pembinaData || []);

      const reguData = await getReguByGudep(gudepId);
      setRegu(reguData || []);

      const pesertaData = await getPesertaByGudep(gudepId);
      setPeserta(pesertaData || []);

    } catch (error) {

      console.error("DETAIL LAPORAN :", error);

    }

  }


// ===============================
// TAMBAHKAN DI SINI
// ===============================


// ===============================
// CETAK PDF
// ===============================

function cetakPDF() {

  const element = document.getElementById("laporan-pdf");


  if (!element) {
    alert("Elemen laporan tidak ditemukan");
    return;
  }


  // FIX html2canvas ERROR OKLCH
  document.querySelectorAll("*").forEach((el) => {

    const style = window.getComputedStyle(el);


    if (style.color.includes("oklch")) {
      el.style.color = "#000000";
    }


    if (style.backgroundColor.includes("oklch")) {
      el.style.backgroundColor = "#ffffff";
    }


    if (style.borderColor.includes("oklch")) {
      el.style.borderColor = "#000000";
    }

  });



  setTimeout(() => {


    html2pdf()

      .set({

        margin: 0.3,

        filename:
          `Laporan-${profil.nama_pangkalan || "Gudep"}.pdf`,

        image: {
          type: "jpeg",
          quality: 1,
        },


        html2canvas: {

           scale:2,
  useCORS:true,
  width:794,
  windowWidth:794

        },


        jsPDF: {

          unit: "mm",

          format: "a4",

          orientation: "portrait",

        },

      })

      .from(element)

      .save();


  }, 300);


}

    const pembinaPutra =
    pembina.filter((x) => x.jk === "Putra").length;

const pembinaPutri =
    pembina.filter((x) => x.jk === "Putri").length;

const pesertaPutra =
    peserta.filter((x) => x.jk === "Putra").length;

const pesertaPutri =
    peserta.filter((x) => x.jk === "Putri").length;
  return (

  <>

    {/* HEADER (TIDAK IKUT DICETAK) */}
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-green-700">
          📊 Detail Laporan Gudep
        </h1>

        <p className="text-gray-500 mt-1">
          Laporan lengkap peserta Jambore Ranting 2026
        </p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={cetakPDF}
          className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-5
            py-2
            rounded-lg
            font-semibold
          "
        >
          📄 Cetak PDF
        </button>

        <button
          onClick={() => navigate("/admin/laporan")}
          className="
            bg-slate-600
            hover:bg-slate-700
            text-white
            px-5
            py-2
            rounded-lg
            shadow
            font-semibold
          "
        >
          ← Kembali
        </button>

      </div>

    </div>

    {/* YANG AKAN DICETAK KE PDF */}
    <div
  id="laporan-pdf"
  className="max-w-5xl mx-auto bg-white p-6"
>



      {/* PROFIL */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-green-700 mb-5">
          🏫 Profil Gugus Depan
        </h2>

        <table className="w-full">

          <tbody>

            <tr>
              <td className="font-semibold w-56 py-2">
                Nama Pangkalan
              </td>
              <td>{profil.nama_pangkalan}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Gudep Putra
              </td>
              <td>{profil.gudep_putra}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Gudep Putri
              </td>
              <td>{profil.gudep_putri}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Kwarran
              </td>
              <td>{profil.kwarran}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Kabupaten
              </td>
              <td>{profil.kabupaten}</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* STATISTIK */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">
            🧑 Pembina Putra
          </div>

          <div className="text-4xl font-bold text-blue-700">
            {pembinaPutra}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">
            👩 Pembina Putri
          </div>

          <div className="text-4xl font-bold text-pink-600">
            {pembinaPutri}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">
            ⛺ Jumlah Regu
          </div>

          <div className="text-4xl font-bold text-orange-600">
            {regu.length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">
            👦 Peserta Putra
          </div>

          <div className="text-4xl font-bold text-blue-700">
            {pesertaPutra}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">
            👧 Peserta Putri
          </div>

          <div className="text-4xl font-bold text-pink-600">
            {pesertaPutri}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">
            👥 Total Peserta
          </div>

          <div className="text-4xl font-bold text-green-700">
            {peserta.length}
          </div>
        </div>

      </div>

      {/* BAGIAN 2 MULAI DARI SINI */}
            {/* =============================== */}
      {/* DATA PEMBINA */}
      {/* =============================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-blue-700 mb-5">
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

              <th className="border p-3 w-40">
                Jabatan
              </th>

              <th className="border p-3 w-40">
                No. HP
              </th>

            </tr>

          </thead>

          <tbody>

            {pembina.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="border p-5 text-center"
                >
                  Belum ada data pembina
                </td>

              </tr>

            ) : (

              pembina.map((item, index) => (

                <tr key={item.id}>

                  <td className="border p-3 text-center">
                    {index + 1}
                  </td>

                  <td className="border p-3">
                    {item.nama}
                  </td>

                  <td className="border p-3 text-center">
                    {item.jk}
                  </td>

                  <td className="border p-3 text-center">
                    {item.jabatan}
                  </td>

                  <td className="border p-3 text-center">
                    {item.hp}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>



      {/* =============================== */}
      {/* DATA REGU */}
      {/* =============================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-orange-700 mb-5">
          ⛺ Data Regu
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

              <th className="border p-3 w-40">
                Jumlah Anggota
              </th>

            </tr>

          </thead>

          <tbody>

            {regu.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="border p-5 text-center"
                >
                  Belum ada data regu
                </td>

              </tr>

            ) : (

              regu.map((item, index) => (

                <tr key={item.id}>

                  <td className="border p-3 text-center">
                    {index + 1}
                  </td>

                  <td className="border p-3">
                    {item.nama}
                  </td>

                  <td className="border p-3 text-center">
                    {item.jenis}
                  </td>

                  <td className="border p-3 text-center">

                    {
                      peserta.filter(
                        (p) => p.regu === item.nama
                      ).length
                    }

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* BAGIAN 3 MULAI DARI SINI */}
            {/* =============================== */}
      {/* DATA PESERTA PUTRA */}
      {/* =============================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-blue-700 mb-5">
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

            </tr>

          </thead>

          <tbody>

            {peserta.filter(x => x.jk === "Putra").length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="border p-5 text-center"
                >
                  Belum ada peserta putra
                </td>

              </tr>

            ) : (

              peserta
                .filter(x => x.jk === "Putra")
                .map((item, index) => (

                  <tr key={item.id}>

                    <td className="border p-3 text-center">
                      {index + 1}
                    </td>

                    <td className="border p-3">
                      {item.nama}
                    </td>

                    <td className="border p-3 text-center">
                      {item.kelas}
                    </td>

                    <td className="border p-3 text-center">
                      {item.regu}
                    </td>

                  </tr>

                ))

            )}

          </tbody>

        </table>

      </div>



      {/* =============================== */}
      {/* DATA PESERTA PUTRI */}
      {/* =============================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-pink-700 mb-5">
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

            </tr>

          </thead>

          <tbody>

            {peserta.filter(x => x.jk === "Putri").length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="border p-5 text-center"
                >
                  Belum ada peserta putri
                </td>

              </tr>

            ) : (

              peserta
                .filter(x => x.jk === "Putri")
                .map((item, index) => (

                  <tr key={item.id}>

                    <td className="border p-3 text-center">
                      {index + 1}
                    </td>

                    <td className="border p-3">
                      {item.nama}
                    </td>

                    <td className="border p-3 text-center">
                      {item.kelas}
                    </td>

                    <td className="border p-3 text-center">
                      {item.regu}
                    </td>

                  </tr>

                ))

            )}

          </tbody>

        </table>

      </div>

</div>



      {/* TOMBOL KEMBALI */}

      <div className="flex justify-end">

        <button
          onClick={() => navigate("/admin/laporan")}
          className="
            bg-green-700
            hover:bg-green-800
            text-white
            px-8
            py-3
            rounded-xl
            shadow-lg
            font-semibold
          "
        >
          ← Kembali ke Laporan
        </button>

     </div>

      </>


);

}