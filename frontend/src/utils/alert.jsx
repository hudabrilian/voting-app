import Swal from "sweetalert2";

export const showStatusAlert = (type) => {
  Swal.fire({
    icon: type ? "success" : "error",
    title: type === 1 ? "Success" : "Error",
    text: type === 1 ? "Candidate has been updated" : "Something went wrong!",
  });
};
