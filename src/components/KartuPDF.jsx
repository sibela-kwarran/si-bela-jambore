export default function KartuPDF({ peserta }) {
  return (
    <div
      style={{
        width: "360px",
        height: "520px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* Template ID Card */}

      <img
        src="/template/idcard-peserta.png"
        alt="ID Card"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* Nama */}

      <div
        style={{
          position: "absolute",
          left: "158px",
          top: "302px",
          width: "170px",
          fontSize: "13px",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        {peserta.nama}
      </div>

      {/* Regu */}

      <div
        style={{
          position: "absolute",
          left: "158px",
          top: "347px",
          width: "170px",
          fontSize: "13px",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        {peserta.regu}
      </div>

      {/* Nomor Peserta */}

      <div
        style={{
          position: "absolute",
          left: "190px",
          top: "392px",
          width: "120px",
          fontSize: "13px",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        {peserta.noPeserta}
      </div>

      {/* Foto dikosongkan, ditempel manual */}
    </div>
  );
}