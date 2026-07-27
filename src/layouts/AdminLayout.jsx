import { Outlet, Link } from "react-router-dom";




export default function AdminLayout() {


return (

<div className="flex min-h-screen bg-slate-100">


{/* SIDEBAR */}

<aside className="w-72 bg-amber-700 text-white flex flex-col shadow-xl">


{/* BRAND */}

<div className="p-6 border-b border-amber-500 text-center">


<img
  src="/logo/sibela.png"
  className="
    w-24
    h-24
    mx-auto
    object-cover
    rounded-full
    border-4
    border-white
    shadow-lg
    mb-3
  "
/>


<h1 className="text-2xl font-bold">
SI BELA ADMIN
</h1>


<p className="
text-sm
text-amber-100
mt-1
">

Jambore Ranting 2026

</p>


<p className="
text-xs
text-amber-200
">

Kwarran Cikarang Utara

</p>


</div>



{/* MENU */}

<nav className="flex flex-col p-4 gap-2 flex-1">


<Link
to="/admin/dashboard"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

🏠 Dashboard

</Link>



<Link
to="/admin/verifikasi-gudep"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

🏕 Verifikasi Gudep

</Link>



<Link
to="/admin/verifikasi-berkas"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

📄 Verifikasi Berkas

</Link>



<Link
to="/admin/verifikasi-pembayaran"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

💳 Pembayaran

</Link>



<Link
to="/admin/penempatan"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

⛺ Penempatan Blok

</Link>



<Link
to="/admin/peta"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

🗺️ Peta Perkemahan

</Link>



<Link
to="/admin/laporan"
className="
hover:bg-amber-600
rounded-lg
px-4
py-3
transition
"
>

📊 Laporan

</Link>



</nav>




{/* FOOTER */}

<div className="
p-4
text-center
text-xs
border-t
border-amber-500
text-amber-100
">

© SI BELA 2026

</div>



</aside>




{/* CONTENT */}

<main className="flex-1 p-6">

<Outlet />

</main>



</div>


);

}