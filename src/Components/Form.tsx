import React, { useState } from "react";
import useFetch from "react-fetch-hook";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

interface Department {
  id: number;
  name: string;
}
const schema = yup.object().shape({
  name: yup.string().required("Imię i nazwisko jest wymagane"),
  date: yup
    .date()
    .required("Data jest wymagana")
    .typeError("Data musi być w formacie DD/MM/YYYY"),
  email: yup
    .string()
    .email("Email musi być poprawnym adresem")
    .required("Email jest wymagany"),
  department: yup
    .string()
    .test("val", "Proszę wybierz oddział", (val) => val != "Wybierz oddział")
    .required(),
  checkbox: yup.bool().oneOf([true], "Aby kontynuować zaakceptuj regulamin"),
});

const logoSrc =
  "https://diag.pl/katalogi/wp-content/themes/diag/dist/img/square_logo.png";
const getUrl =
  "https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/departments.json";
const postUrl =
  "https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/users.json";

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = () => {
    console.log(data);
    fetch(postUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(() => {
        setMessage("Dane zostały poprawnie zapisane");
        setStatus("success");
      })
      .catch((err) => {
        setMessage(err.toString());
        setStatus("error");
      });
  };

  const { isLoading, data, error } = useFetch<Department[]>(getUrl);

  return isLoading ? (
    <div className="d-flex justify-content-center text-success">
      Ładowanie...
    </div>
  ) : (
    <>
      <div className="text-center">
        <img className="img-fluid w-50 p-3" src={logoSrc}></img>
      </div>
      <div className="d-flex bg-gradient-light">
        <form
          className="col-sm-7 mt-5 my-auto mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <label htmlFor="user-name" className="form-label">
              Imię i nazwisko
            </label>
            <input
              {...register("name")}
              type="name"
              className="form-control"
              id="user-name"
              placeholder="Imię i nazwisko"
              name="name"
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user-birth-date" className="form-label">
              Data urodzenia
            </label>
            <input
              {...register("date")}
              type="text"
              className="form-control"
              id="user-birth-date"
              placeholder="DD/MM/YYYY"
              name="date"
            />
            {errors.date && (
              <p className="text-danger">{errors.date.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user-email" className="form-label">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="form-control"
              id="user-email"
              placeholder="user@example.com"
              name="email"
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user-department" className="form-label">
              Wydział
            </label>
            <select
              {...register("department")}
              className="form-select"
              name="department"
              id="user-department"
              defaultValue="Wybierz oddział"
            >
              <option disabled hidden>
                Wybierz oddział
              </option>
              {data &&
                data.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          {error && (
            <p className="text-danger">{`Wystąpił problem podczas pobierania danych: ${error}`}</p>
          )}
          <div className="form-check">
            <input
              {...register("checkbox")}
              className="form-check-input"
              type="checkbox"
              value=""
              id="form-terms"
              name="checkbox"
            />
            <label className="form-check-label" htmlFor="form-terms">
              Akceptuję regulamin
            </label>
            {errors.checkbox && (
              <p className="text-danger">{errors.checkbox.message}</p>
            )}
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button type="submit" className="btn btn-dark">
              Zapisz
            </Button>
          </div>
          <p className="text-success">{message}</p>
        </form>
      </div>
    </>
  );
};
