const KEY = "dataPendaftaran";

export function getPendaftaran() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function savePendaftaran(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function simpanPendaftaran(gudepBaru) {
  console.log("YANG DISIMPAN =", gudepBaru);
  const data = getPendaftaran();

  const index = data.findIndex(
    item => item.namaGudep === gudepBaru.namaGudep
  );

  if (index >= 0) {
    data[index] = gudepBaru;
  } else {
    data.push(gudepBaru);
  }

  savePendaftaran(data);

  return data;
}

export function getGudepById(id) {
  return getPendaftaran().find(item => item.id === id);
}

export function updateStatus(id, status) {
  const data = getPendaftaran();

  const index = data.findIndex(item => item.id === id);

  if (index >= 0) {
    data[index].status = status;
    savePendaftaran(data);
  }
}