import React, { useState } from "react";
import useFetch from "react-fetch-hook";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "react-bootstrap/Button";
import schema from "./components/Form.schema";
import formTexts from "./components/Form.texts";
import formLinks from "./components/Form.links";

interface Department {
  id: number;
  name: string;
}

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (data: Object) => {
    console.log(data);
    fetch(formLinks.postUrl, {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "multipart/form-data",
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
        setMessage(formTexts.messageSuccessful);
        setStatus(formTexts.success);
      })
      .catch((err) => {
        setMessage(err.toString());
        setStatus(formTexts.error);
      });
  };

  const { isLoading, data, error } = useFetch<Department[]>(formLinks.getUrl);

  return isLoading ? (
    <div className="d-flex justify-content-center text-success">
      {formTexts.loading}
    </div>
  ) : (
    <>
      <div className="text-center">
        <img className="img-fluid w-50 p-3" src={formLinks.logoSrc}></img>
      </div>
      <div className="d-flex bg-gradient-light">
        <form
          className="col-sm-7 mt-5 my-auto mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <label htmlFor="user-name" className="form-label">
              {formTexts.name}
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
              {formTexts.dateOfBirth}
            </label>
            <input
              {...register("date")}
              type="text"
              className="form-control"
              id="user-birth-date"
              placeholder="MM/DD/YYYY"
              name="date"
            />
            {errors.date && (
              <p className="text-danger">{errors.date.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user-email" className="form-label">
              {formTexts.email}
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
              {formTexts.department}
            </label>
            <select
              {...register("department")}
              className="form-select"
              name="department"
              id="user-department"
              defaultValue="Wybierz oddział"
            >
              <option disabled hidden>
                {formTexts.chooseDepartment}
              </option>
              {data &&
                data.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="user-upload" className="form-label">
              {formTexts.upload}
            </label>
            <input
              type="file"
              {...register("file")}
              name="file"
              id="uploaded-file"
            ></input>
          </div>
          {error && (
            <p className="text-danger">
              {formTexts.getDataError}
              {error}
            </p>
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
              {formTexts.acceptConditions}
            </label>
            {errors.checkbox && (
              <p className="text-danger">{errors.checkbox.message}</p>
            )}
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button type="submit" className="btn btn-dark">
              {formTexts.save}
            </Button>
          </div>
          <p className="text-success">{message}</p>
        </form>
      </div>
    </>
  );
};
