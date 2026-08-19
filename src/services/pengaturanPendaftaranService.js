import supabase from "../lib/supabase";

const TABLE = "pengaturan_pendaftaran";

// ========================================
// AMBIL PENGATURAN PENDAFTARAN
// ========================================
export async function getPengaturanPendaftaran() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}


// ========================================
// CEK APAKAH PENDAFTARAN MASIH DIBUKA
// ========================================
export async function cekPendaftaranDibuka() {

  const pengaturan =
    await getPengaturanPendaftaran();


  // Kalau belum ada pengaturan
  // kita anggap ditutup agar aman
  if (!pengaturan) {

    return {
      dibuka: false,
      pengaturan: null,
    };

  }


  // ========================================
  // ADMIN MENUTUP MANUAL
  // ========================================
  if (pengaturan.status === "ditutup") {

    return {
      dibuka: false,
      otomatisDitutup: false,
      pengaturan,
    };

  }


  // ========================================
  // ADMIN MEMBUKA KEMBALI SECARA MANUAL
  // ========================================
  if (pengaturan.status === "dibuka" &&
      pengaturan.manual_override === true) {

    return {
      dibuka: true,
      otomatisDitutup: false,
      manualOverride: true,
      pengaturan,
    };

  }


  // ========================================
  // CEK TANGGAL & JAM PENUTUPAN OTOMATIS
  // WIB = UTC+7
  // ========================================
  if (
    pengaturan.tanggal_tutup &&
    pengaturan.jam_tutup
  ) {

    const deadlineString =
      `${pengaturan.tanggal_tutup}T${pengaturan.jam_tutup}`;

    const deadlineUTC =
      new Date(`${deadlineString}+07:00`);

    const sekarang = new Date();


    if (sekarang >= deadlineUTC) {

      return {
        dibuka: false,
        otomatisDitutup: true,
        pengaturan,
      };

    }

  }


  return {
    dibuka: true,
    otomatisDitutup: false,
    manualOverride: false,
    pengaturan,
  };

}


// ========================================
// SIMPAN PENGATURAN PENDAFTARAN
// ========================================
export async function updatePengaturanPendaftaran(
  id,
  data
) {

  const { data: hasil, error } =
    await supabase
      .from(TABLE)
      .update({

        status: data.status,

        tanggal_tutup:
          data.tanggal_tutup,

        jam_tutup:
          data.jam_tutup,

        pesan_penutupan:
          data.pesan_penutupan,

        // Kalau Admin menyimpan status
        // "dibuka", override manual aktif.
        manual_override:
          data.status === "dibuka",

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();


  if (error) throw error;

  return hasil;

}


// ========================================
// BUKA PENDAFTARAN
// ========================================
export async function bukaPendaftaran(id) {

  const { data, error } =
    await supabase
      .from(TABLE)
      .update({

        status: "dibuka",

        manual_override: true,

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();


  if (error) throw error;

  return data;

}


// ========================================
// TUTUP PENDAFTARAN
// ========================================
export async function tutupPendaftaran(id) {

  const { data, error } =
    await supabase
      .from(TABLE)
      .update({

        status: "ditutup",

        manual_override: false,

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();


  if (error) throw error;

  return data;

}