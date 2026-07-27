import supabase from "../lib/supabase";

const TABLE = "operator_gudep";


// ============================
// CEK EMAIL
// ============================
export async function getOperatorByEmail(email) {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("email", email)
    .maybeSingle();


  if (error) throw error;


  return data;

}


// ============================
// DAFTAR OPERATOR
// ============================
export async function registerOperator(form) {


  const operator = await getOperatorByEmail(form.email);


  if (operator) {
    throw new Error("Email sudah terdaftar.");
  }


  const { data, error } = await supabase
    .from(TABLE)
    .insert({

      nama_operator: form.namaOperator,

      email: form.email,

      no_hp: form.noHp,

      password: form.password,

      status: "aktif",

    })
    .select()
    .single();


  if (error) throw error;


  return data;

}



// ============================
// LOGIN OPERATOR
// ============================
export async function loginOperator(email, password) {


  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .eq("status", "aktif")
    .maybeSingle();


  if (error) throw error;


  return data;

}