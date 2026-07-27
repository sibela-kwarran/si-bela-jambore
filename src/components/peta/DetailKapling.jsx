export default function DetailKapling({

  gudep,

  jenis,

  onClose,

}) {

  if (!gudep) return null;
console.log(
"DETAIL JENIS :",
jenis,
gudep
);
  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">

        <h2 className="text-2xl font-bold text-green-700 mb-5">

          🏕️ DETAIL KAPLING

        </h2>

        <table className="w-full">

          <tbody>

            <tr>

              <td className="font-semibold py-2">
                Gudep
              </td>

              <td>
 {gudep.profil_gudep?.nama_pangkalan 
 || gudep.nama_gudep 
 || "-"}
</td>

            </tr>

            {
jenis === "Putra" ? (

<>

<tr>
<td className="font-semibold py-2">
Kecamatan Putra
</td>

<td>
{gudep.kecamatan_putra || "-"}
</td>
</tr>


<tr>
<td className="font-semibold py-2">
Kelurahan Putra
</td>

<td>
{gudep.kelurahan_putra || "-"}
</td>
</tr>


<tr>
<td className="font-semibold py-2">
Kapling Putra
</td>

<td>
{gudep.kapling_putra || "-"}
</td>
</tr>

</>

) : (

<>

<tr>
<td className="font-semibold py-2">
Kecamatan Putri
</td>

<td>
{gudep.kecamatan_putri || "-"}
</td>
</tr>


<tr>
<td className="font-semibold py-2">
Kelurahan Putri
</td>

<td>
{gudep.kelurahan_putri || "-"}
</td>
</tr>


<tr>
<td className="font-semibold py-2">
Kapling Putri
</td>

<td>
{gudep.kapling_putri || "-"}
</td>
</tr>

</>

)
}

          </tbody>

        </table>

        <div className="flex justify-end gap-3 mt-6">

          

          <button

            onClick={onClose}

            className="bg-gray-500 text-white px-5 py-2 rounded-lg"

          >

            Tutup

          </button>

        </div>

      </div>

    </div>

  );

}