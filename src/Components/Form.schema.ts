import * as yup from "yup";

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

export default schema;
