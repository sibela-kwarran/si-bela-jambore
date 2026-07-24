import GudepForm from "../../components/profil/GudepForm";
import GudepSummary from "../../components/profil/GudepSummary";

export default function ProfilGudep() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-green-700">
          Profil Gugus Depan
        </h1>

        <p className="text-gray-500">
          Lengkapi identitas Gugus Depan.
        </p>
      </div>

      <GudepForm />

      <GudepSummary />

    </div>
  );
}