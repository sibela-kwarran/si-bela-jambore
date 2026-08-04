import LandingPage from "../pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

console.log("ROUTER SI BELA AKTIF VERSI PESERTA");
import Login from "../pages/auth/Login";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/operator/Dashboard";
import ProfilGudep from "../pages/operator/ProfilGudep";
import DataPembina from "../pages/operator/DataPembina";
import DataRegu from "../pages/operator/DataRegu";
import DataPeserta from "../pages/operator/DataPeserta";
import UploadBerkas from "../pages/operator/UploadBerkas";
import Pembayaran from "../pages/operator/Pembayaran";
import KonfirmasiData from "../pages/operator/KonfirmasiData.jsx";
import StatusVerifikasi from "../pages/operator/StatusVerifikasi";
import DownloadKartu from "../pages/operator/DownloadKartu";
import KartuKapling from "../pages/operator/KartuKapling";
import DaftarOperator from "../pages/auth/DaftarOperator";


import LoginAdmin from "../pages/auth/LoginAdmin";
import VerifikasiPembayaran from "../pages/admin/VerifikasiPembayaran";
import AdminLayout from "../layouts/AdminLayout";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import VerifikasiGudep from "../pages/admin/VerifikasiGudep";
import VerifikasiBerkas from "../pages/admin/VerifikasiBerkas";
import DataPesertaAdmin from "../pages/admin/DataPesertaAdmin";
import DetailGudep from "../pages/admin/DetailGudep";
import PenempatanBlok from "../pages/admin/PenempatanBlok";
import PetaPerkemahan from "../pages/admin/PetaPerkemahan";

import Laporan from "../pages/admin/Laporan";
import DetailLaporan from "../pages/admin/DetailLaporan";



export default function AppRoutes() {
  console.log("APP ROUTES DIRENDER");






  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

<Route path="/login" element={<Login />} />
<Route path="/admin-login" element={<LoginAdmin />} />
<Route
  path="/daftar-operator"
  element={<DaftarOperator />}
/>



        <Route path="/operator" element={<MainLayout />}>

  <Route path="dashboard" element={<Dashboard />} />
  <Route path="profil" element={<ProfilGudep />} />
  <Route path="pembina" element={<DataPembina />} />
  <Route path="regu" element={<DataRegu />} />
  <Route path="peserta" element={<DataPeserta />} />
  <Route path="upload" element={<UploadBerkas />} />
  <Route path="pembayaran" element={<Pembayaran />} />
  <Route path="konfirmasi" element={<KonfirmasiData />} />
  <Route path="status" element={<StatusVerifikasi />} />
 <Route
    path="kartu"
    element={<DownloadKartu />}
  />
<Route
  path="kapling/:id"
  element={<KartuKapling />}
/>

</Route>

<Route path="/admin" element={<AdminLayout />}>

  <Route
    path="dashboard"
    element={<DashboardAdmin />}
  />

  <Route
    path="verifikasi-pembayaran"
    element={<VerifikasiPembayaran />}
  />

<Route
  path="verifikasi-gudep"
  element={<VerifikasiGudep />}
/>
<Route
  path="verifikasi-berkas"
  element={<VerifikasiBerkas />}
/>
<Route
  path="data-peserta"
  element={<DataPesertaAdmin />}
/>

<Route
  path="detail-gudep/:id"
  element={<DetailGudep />}
/>
<Route
  path="penempatan"
  element={<PenempatanBlok />}
 />
<Route
  path="peta"
  element={<PetaPerkemahan />}
/>
<Route
path="/admin/laporan"
element={<Laporan />}
/>
<Route
    path="detail-laporan/:id"
    element={<DetailLaporan />}
  />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}