import { useState, useEffect } from "react";

import {
    FaUsers,
    FaUserTie,
    FaUserGraduate,
    FaFolderOpen,
} from "react-icons/fa";


import StatCard from "../../components/dashboard/StatCard";
import ProgressCard from "../../components/dashboard/ProgressCard";
import ActivityCard from "../../components/dashboard/ActivityCard";



export default function Dashboard() {
const [jumlahPembina, setJumlahPembina] = useState(0);

const [jumlahRegu, setJumlahRegu] = useState(0);

const [jumlahPeserta, setJumlahPeserta] = useState(0);

const [jumlahBerkas, setJumlahBerkas] = useState(0);

    



    useEffect(() => {


        const data = localStorage.getItem(
            "dataPembina"
        );


        if(data){

            const pembina = JSON.parse(data);


            setJumlahPembina(
                pembina.length
            );

        }


    },[]);

useEffect(() => {

    const pembina =
        JSON.parse(localStorage.getItem("dataPembina")) || [];

    const regu =
        JSON.parse(localStorage.getItem("dataRegu")) || [];

    const peserta =
        JSON.parse(localStorage.getItem("dataPeserta")) || [];

    const berkas =
    JSON.parse(localStorage.getItem("uploadBerkas")) || {};

    setJumlahPembina(pembina.length);

    setJumlahRegu(regu.length);

    setJumlahPeserta(peserta.length);

    const totalBerkas =
    (berkas.suratTugas ? 1 : 0) +
    (berkas.suratIzin ? 1 : 0);

setJumlahBerkas(totalBerkas);

}, []);

    return (

        <div className="space-y-8">


            <div className="grid grid-cols-4 gap-6">



                <StatCard
    title="Total Peserta"
    value={jumlahPeserta}
    color="#2563eb"
    icon={<FaUserGraduate />}
/>



                <StatCard
    title="Total Pembina"
    value={jumlahPembina}
    color="#16a34a"
    icon={<FaUserTie />}
/>



                <StatCard
    title="Total Regu"
    value={jumlahRegu}
    color="#f59e0b"
    icon={<FaUsers />}
/>



<StatCard
    title="Berkas Upload"
    value={jumlahBerkas}
    color="#7c3aed"
    icon={<FaFolderOpen />}
/>


            </div>




            <div className="grid grid-cols-2 gap-6">


                <ProgressCard />


                <ActivityCard />


            </div>



           



        </div>

    );

}