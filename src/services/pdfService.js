import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function cetakLaporanGudepPDF({
  profil,
  pembina,
  regu,
  peserta,
}) {

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ==========================
  // HEADER
  // ==========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text(
    "LAPORAN JAMBORE RANTING",
    105,
    18,
    { align: "center" }
  );

  doc.setFontSize(14);

  doc.text(
    "KWARRAN CIKARANG UTARA",
    105,
    26,
    { align: "center" }
  );

  doc.setFontSize(11);

  doc.text(
    "SI BELA - Sistem Informasi Bela Negara",
    105,
    33,
    { align: "center" }
  );

  doc.line(15, 38, 195, 38);

  // ==========================
  // PROFIL
  // ==========================

  let y = 48;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");

  doc.text("Profil Gugus Depan", 15, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Nama Pangkalan : ${profil.nama_pangkalan || "-"}`,
    15,
    y
  );

  y += 7;

  doc.text(
    `Gudep Putra : ${profil.gudep_putra || "-"}`,
    15,
    y
  );

  y += 7;

  doc.text(
    `Gudep Putri : ${profil.gudep_putri || "-"}`,
    15,
    y
  );

  y += 7;

  doc.text(
    `Kwarran : ${profil.kwarran || "-"}`,
    15,
    y
  );

  y += 7;

  doc.text(
    `Kabupaten : ${profil.kabupaten || "-"}`,
    15,
    y
  );

  y += 7;

  doc.text(
    `Provinsi : ${profil.provinsi || "-"}`,
    15,
    y
  );

  y += 15;

  // ==========================
  // RINGKASAN
  // ==========================

  doc.setFont("helvetica", "bold");

  doc.text("Ringkasan", 15, y);

  y += 5;

  autoTable(doc, {
    startY: y,

    head: [["Keterangan", "Jumlah"]],

    body: [

      [
        "Pembina Putra",
        pembina.filter(x => x.jk === "Putra").length
      ],

      [
        "Pembina Putri",
        pembina.filter(x => x.jk === "Putri").length
      ],

      [
        "Jumlah Regu",
        regu.length
      ],

      [
        "Peserta Putra",
        peserta.filter(x => x.jk === "Putra").length
      ],

      [
        "Peserta Putri",
        peserta.filter(x => x.jk === "Putri").length
      ],

      [
        "Total Peserta",
        peserta.length
      ],

    ],

    theme: "grid",

    headStyles: {
      fillColor: [22, 163, 74],
    },

  });

}