export default function StatCard({
  icon,
  title,
  value,
}) {

return (

<div className="
bg-white
rounded-xl
shadow
p-6
border
hover:shadow-lg
transition
">

<div className="flex items-center gap-4">

<div className="
text-4xl
">
{icon}
</div>


<div>

<p className="
text-gray-500
text-sm
font-semibold
">
{title}
</p>


<h2 className="
text-3xl
font-bold
text-green-700
">
{value}
</h2>


</div>


</div>


</div>

);

}