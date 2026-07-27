import { useState, useEffect } from "react";

import DetailKapling from "../../components/peta/DetailKapling";

import KecamatanCard from "../../components/peta/KecamatanCard";

import {
  getPeta
} from "../../services/petaService";

import {
 getDetailKapling
} from "../../services/petaService";

export default function PetaPerkemahan() {


const [data,setData] = useState([]);

const [selectedGudep,setSelectedGudep] = useState(null);
const [jenisKapling,setJenisKapling] = useState("");


useEffect(()=>{

  loadPeta();

},[]);



async function loadPeta(){

try{


const hasil = await getPeta();


console.log(
"DATA PETA PERKEMAHAN:",
hasil
);


setData(hasil);



}catch(error){

console.error(
"GAGAL LOAD PETA:",
error
);


}

}




const cariKapling = (
  kelurahan,
  nomor,
  jenis
)=>{


return data.find((item)=>{


if(jenis==="putra"){

return (
 item.kelurahan_putra === kelurahan
 &&
 item.kapling_putra === nomor
);

}


if(jenis==="putri"){

return (
 item.kelurahan_putri === kelurahan
 &&
 item.kapling_putri === nomor
);

}


});


};


async function loadPeta(){

try{


const hasil = await getPeta();


console.table(hasil);


setData(hasil);


}catch(error){

console.error(error);

}

}
  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-green-700">
        Peta Bumi Perkemahan
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-2">
          Layout Perkemahan Jambore Ranting
        </h2>

        <p className="text-gray-500 mb-6">
          Penempatan Gudep Putra dan Putri
        </p>

        <div className="grid grid-cols-2 gap-8">

  <KecamatanCard
  jenis="putra"
  data={data}
  cariKapling={cariKapling}

  onSelectGudep={async(item)=>{

 try{

 const detail =
 await getDetailKapling(item.gudep_id);


 console.log(
 "KLIK PUTRA",
 detail
 );


 setSelectedGudep(detail);

 setJenisKapling("Putra");


 }catch(error){

 console.error(error);

 }

}}
/>

  <KecamatanCard
  jenis="putri"
  data={data}
  cariKapling={cariKapling}

  onSelectGudep={async(item)=>{

    try{

      const detail =
      await getDetailKapling(item.gudep_id);


      setSelectedGudep(detail);

      setJenisKapling("Putri");


    }catch(error){

      console.error(error);

    }

  }}
/>

</div>

          
          </div>
<DetailKapling

  gudep={selectedGudep}

  jenis={jenisKapling}

  onClose={() => setSelectedGudep(null)}

/>
        </div>

  );

}