import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import PendaftaranDitutup
  from "../../pages/operator/PendaftaranDitutup";

import {
  cekPendaftaranDibuka,
} from "../../services/pengaturanPendaftaranService";


export default function OperatorGuard() {

  const [loading, setLoading] = useState(true);

  const [pendaftaranDibuka, setPendaftaranDibuka] =
    useState(false);


  useEffect(() => {

    async function checkPendaftaran() {

      try {

        const operator =
          localStorage.getItem("operatorLogin");

        if (!operator) {

          window.location.href = "/login";

          return;

        }


        const hasil =
  await cekPendaftaranDibuka();



setPendaftaranDibuka(
  hasil.dibuka
);

      } catch (error) {

        console.error(
          "Gagal mengecek status pendaftaran:",
          error
        );

        setPendaftaranDibuka(false);

      } finally {

        setLoading(false);

      }

    }


    checkPendaftaran();

  }, []);


  if (loading) {

    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-100
        "
      >

        <div className="text-center">

          <div
            className="
              animate-spin
              rounded-full
              h-10
              w-10
              border-b-2
              border-green-700
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-600">
            Memeriksa status pendaftaran...
          </p>

        </div>

      </div>
    );

  }


  if (!pendaftaranDibuka) {

    return <PendaftaranDitutup />;

  }


  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );

}