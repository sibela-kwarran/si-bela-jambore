import { useState, useEffect } from "react";
const profilGudep =
  JSON.parse(localStorage.getItem("profilGudep")) || {};

export default function DataPembina() {

  const [showForm, setShowForm] = useState(false);

const profil =
  JSON.parse(localStorage.getItem("profilGudep")) || {};

  const [dataPembina, setDataPembina] = useState(() => {

  const data = localStorage.getItem("dataPembina");

  return data ? JSON.parse(data) : [];

});
    const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    jk: "Putra",
    jabatan: "Pembina",
    hp: "",
  });


  function handleChange(e){

    const {name,value} = e.target;

    setForm({
      ...form,
      [name]: value
    });

  }


  function simpanPembina(e){

  e.preventDefault();


  if(editIndex !== null){

    const update = [...dataPembina];

    update[editIndex] = {
  ...form,
  namaGudep: profilGudep.pangkalan,
};

    setDataPembina(update);

    setEditIndex(null);

  } 
  else {


    const jumlahPutra = dataPembina.filter(
      item => item.jk === "Putra"
    ).length;


    const jumlahPutri = dataPembina.filter(
      item => item.jk === "Putri"
    ).length;



    if(
      form.jk === "Putra" &&
      jumlahPutra >= 3
    ){

      alert("Maksimal 3 Pembina Putra");

      return;

    }



    if(
      form.jk === "Putri" &&
      jumlahPutri >= 3
    ){

      alert("Maksimal 3 Pembina Putri");

      return;

    }



   const dataBaru = [
  ...dataPembina,
  {
    ...form,
    namaGudep: profilGudep.pangkalan,
  },
];

console.log("DATA BARU:", dataBaru);

setDataPembina(dataBaru);


  }


  setForm({

    nama:"",
    jk:"Putra",
    jabatan:"Pembina",
    hp:""

  });


  setShowForm(false);

}
function editPembina(index){

  setForm(dataPembina[index]);

  setEditIndex(index);

  setShowForm(true);

}
function hapusPembina(index){

  const yakin = window.confirm(
    "Hapus data pembina ini?"
  );


  if(yakin){

    const data = [...dataPembina];

    data.splice(index,1);

    setDataPembina(data);

  }

}
useEffect(() => {

  console.log("MENYIMPAN KE LOCALSTORAGE:", dataPembina);

  localStorage.setItem(
    "dataPembina",
    JSON.stringify(dataPembina)
  );

}, [dataPembina]);

  return (

    <div className="space-y-6">


      <div>

        <h1 className="text-3xl font-bold text-green-700">
          Data Pembina
        </h1>

        <p className="text-gray-500">
          Kelola data pembina Gugus Depan.
        </p>

      </div>



      <div className="bg-white rounded-xl shadow p-6">


        <button

          onClick={()=>setShowForm(true)}

          className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"

        >

          + Tambah Pembina

        </button>



        {
          showForm && (

            <form
              onSubmit={simpanPembina}
              className="mt-6 border rounded-xl p-6 bg-gray-50"
            >


              <div className="grid grid-cols-2 gap-5">


                <div>

                  <label className="block mb-2 font-semibold">
                    Nama Pembina
                  </label>

                  <input

                    name="nama"

                    value={form.nama}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                    required

                  />

                </div>



                <div>

                  <label className="block mb-2 font-semibold">
                    Jenis Kelamin
                  </label>


                  <select

                    name="jk"

                    value={form.jk}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                  >

                    <option value="Putra">
                      Pembina Putra
                    </option>


                    <option value="Putri">
                      Pembina Putri
                    </option>


                  </select>


                </div>




                <div>

                  <label className="block mb-2 font-semibold">
                    Jabatan
                  </label>


                  <select

                    name="jabatan"

                    value={form.jabatan}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                  >

                    <option>
                      Pembina
                    </option>

                    <option>
                      Pembantu Pembina
                    </option>

                    <option>
                      Ketua Gugus Depan
                    </option>


                  </select>


                </div>



                <div>

                  <label className="block mb-2 font-semibold">
                    No HP
                  </label>


                  <input

                    name="hp"

                    value={form.hp}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                  />

                </div>


              </div>




              <div className="mt-6 flex gap-3">


                <button

                  type="submit"

                  className="bg-green-700 text-white px-6 py-3 rounded-lg"

                >

                  Simpan

                </button>



                <button

                  type="button"

                  onClick={()=>setShowForm(false)}

                  className="bg-gray-400 text-white px-6 py-3 rounded-lg"

                >

                  Batal

                </button>


              </div>


            </form>

          )
        }



        <table className="w-full mt-8 border">


          <thead className="bg-green-700 text-white">


            <tr>

              <th className="p-3">
                No
              </th>

              <th className="p-3">
                Nama Pembina
              </th>

              <th className="p-3">
                Jenis
              </th>

              <th className="p-3">
                Jabatan
              </th>

              <th className="p-3">
                No HP
              </th>
<th className="p-3">
 Aksi
</th>

            </tr>


          </thead>



          <tbody>


          {
            dataPembina.length===0 ?

            (

              <tr>

                <td
                colSpan="5"
                className="text-center p-5"
                >

                Belum ada data pembina

                </td>

              </tr>

            )

            :

            dataPembina.map((item,index)=>(

              <tr key={index}>


                <td className="border p-3">
                  {index+1}
                </td>


                <td className="border p-3">
                  {item.nama}
                </td>


                <td className="border p-3">
                  {item.jk}
                </td>


                <td className="border p-3">
                  {item.jabatan}
                </td>


                <td className="border p-3">
                  {item.hp}
                </td>
<td className="border p-3 space-x-2">


<button

onClick={()=>editPembina(index)}

className="bg-blue-600 text-white px-3 py-1 rounded"

>

Edit

</button>



<button

onClick={()=>hapusPembina(index)}

className="bg-red-600 text-white px-3 py-1 rounded"

>

Hapus

</button>


</td>

              </tr>

            ))

          }


          </tbody>


        </table>


      </div>


    </div>

  );

}