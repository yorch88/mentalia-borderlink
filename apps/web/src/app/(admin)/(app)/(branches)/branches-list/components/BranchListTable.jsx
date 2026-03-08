import { useEffect, useState } from "react";
import { getBranches, createBranch } from "../../api";
import { LuPlus, LuSearch } from "react-icons/lu";
import Alert from "@/components/Alert";
const BranchListTable = () => {

  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    street: "",
    num_ext: "",
    num_int: "",
    zip_code: "",
    city: "",
    state: "",
    country: "MX"
  });

  /* ========================
     ALERT STATE
  ======================== */

  const [alert, setAlert] = useState(null);

  function showAlert(type, message) {

    setAlert({ type, message });

    setTimeout(() => {
      setAlert(null);
    }, 4000);

  }

  useEffect(() => {
    loadBranches();
  }, []);

  async function loadBranches() {

    try {

      const data = await getBranches();
      setBranches(data);

    } catch (err) {

      console.error(err);
      showAlert("error", "Error cargando sucursales");

    }

  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      const payload = {
        name: form.name,
        address: {
          street: form.street,
          num_ext: form.num_ext,
          num_int: form.num_int,
          zip_code: form.zip_code,
          city: form.city,
          state: form.state,
          country: form.country
        }
      };

      await createBranch(payload);

      showAlert("success", "Sucursal creada correctamente");

      setShowModal(false);

      setForm({
        name: "",
        street: "",
        num_ext: "",
        num_int: "",
        zip_code: "",
        city: "",
        state: "",
        country: "MX"
      });

      loadBranches();

    } catch (err) {

      showAlert("error", err.message || "Error creando sucursal");

    }

  }

  /* =========================
     FORMAT ADDRESS
  ========================= */

  function formatAddress(address) {

    if (!address) return "-";

    const street = address.street || "";
    const numExt = address.num_ext || "";
    const numInt = address.num_int ? `int #${address.num_int}` : "";
    const city = address.city || "";
    const state = address.state || "";
    const country = address.country || "";
    const zip = address.zip_code || "";

    return `${street} #${numExt} ${numInt} - ${city} ${state} ${country} CP ${zip}`.trim();

  }

  return (

    <div className="card">

      {/* ALERT */}

      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      {/* HEADER */}

      <div className="card-header flex justify-between items-center">

        <h6 className="card-title">
          Branches List
        </h6>

        <button
          className="btn btn-sm bg-primary text-white"
          onClick={() => setShowModal(true)}
        >
          <LuPlus className="size-4 me-1" />
          Add Branch
        </button>

      </div>

      {/* SEARCH */}

      <div className="card-header">

        <div className="relative w-64">

          <input
            className="form-input form-input-sm ps-9"
            placeholder="Search branch"
          />

          <div className="absolute inset-y-0 start-0 flex items-center ps-3">
            <LuSearch className="size-3.5 text-default-500" />
          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-default-200">

          <thead className="bg-default-150">

            <tr className="text-sm text-default-700">

              <th className="px-3.5 py-3 text-start">
                ID
              </th>

              <th className="px-3.5 py-3 text-start">
                Name
              </th>

              <th className="px-3.5 py-3 text-start">
                Address
              </th>

            </tr>

          </thead>

          <tbody>

            {branches.map(branch => (

              <tr key={branch.id} className="text-sm">

                <td className="px-3.5 py-3 text-primary">
                  {branch.id}
                </td>

                <td className="px-3.5 py-3">
                  {branch.name}
                </td>

                <td className="px-3.5 py-3">
                  {formatAddress(branch.address)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-[500px]">

            <h3 className="text-lg font-semibold mb-4">
              Crear Sucursal
            </h3>

            <form onSubmit={handleSubmit}>

              <input
                className="form-input w-full mb-3"
                placeholder="Nombre sucursal"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                className="form-input w-full mb-3"
                placeholder="Street"
                value={form.street}
                onChange={(e) =>
                  setForm({ ...form, street: e.target.value })
                }
                required
              />

              <div className="flex gap-2 mb-3">

                <input
                  className="form-input w-full"
                  placeholder="Num Ext"
                  value={form.num_ext}
                  onChange={(e) =>
                    setForm({ ...form, num_ext: e.target.value })
                  }
                />

                <input
                  className="form-input w-full"
                  placeholder="Num Int"
                  value={form.num_int}
                  onChange={(e) =>
                    setForm({ ...form, num_int: e.target.value })
                  }
                />

              </div>

              <div className="flex gap-2 mb-3">

                <input
                  className="form-input w-full"
                  placeholder="Zip Code"
                  value={form.zip_code}
                  onChange={(e) =>
                    setForm({ ...form, zip_code: e.target.value })
                  }
                />

                <input
                  className="form-input w-full"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />

              </div>

              <input
                className="form-input w-full mb-4"
                placeholder="State"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
              />

              <div className="flex gap-2">

                <button
                  type="submit"
                  className="btn bg-primary text-white flex-1"
                >
                  Crear
                </button>

                <button
                  type="button"
                  className="btn bg-gray-200 flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default BranchListTable;