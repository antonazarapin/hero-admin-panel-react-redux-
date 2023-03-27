import { ErrorMessage, Field, useFormik, Form, Formik } from "formik";
import * as Yup from "yup"
import { v4 as uuidv4 } from 'uuid';

import { useDispatch } from 'react-redux';
import { heroAdd } from "../../actions";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const dispatch = useDispatch();

    return (
        <Formik
            initialValues = {{
                name: '',
                description: '',
                element: ''
            }}
            validationSchema = {Yup.object({
                name: Yup.string()
                            .min(2, 'Минимум 2 символа')
                            .required('*Обязательное поле'),
                description: Yup.string()
                            .min(10, 'Не менее 10 символов')
                            .required('*Обязательное поле'),
                element: Yup.string().required('*Выберите элемент героя'),
            })}
            onSubmit = {values => {
                const newHero = {
                    id: uuidv4(),
                    name: values.name,
                    description: values.description,
                    element: values.element
                }
                
                fetch(`http://localhost:3001/heroes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                    body: JSON.stringify({
                        id: `${newHero.id}`,
                        name: `${newHero.name}`, 
                        description: `${newHero.description}`, 
                        element: `${newHero.element}` })})
                    .then(dispatch(heroAdd(newHero)))
                    .catch(error => console.error(error))
            }}>


            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"
                        />

                    <ErrorMessage name="name" style={{color: 'red', paddingLeft: '7px'}} component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        name="description" 
                        className="form-control" 
                        id="description" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>

                    <ErrorMessage name="description" style={{color: 'red', paddingLeft: '7px'}} component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field 
                        required
                        className="form-select" 
                        id="element" 
                        name="element"
                        as='select'>
                        <option >Я владею элементом...</option>
                        <option value="fire">Огонь</option>
                        <option value="water">Вода</option>
                        <option value="wind">Ветер</option>
                        <option value="earth">Земля</option>
                    </Field>

                    <ErrorMessage name="element" style={{color: 'red', paddingLeft: '7px'}} component="div"/>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>



    )
}

export default HeroesAddForm;