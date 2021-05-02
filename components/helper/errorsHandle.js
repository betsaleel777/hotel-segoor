const errorsWriting = (errors, DataErrorsComponent) => {
  for (const item in errors) {
    if (Object.hasOwnProperty.call(errors, item)) {
      DataErrorsComponent[item].exist = true
      DataErrorsComponent[item].message = errors[item][0]
    }
  }
}

const errorsInitialise = (DataErrorsComponent) => {
  for (const item in DataErrorsComponent) {
    if (Object.hasOwnProperty.call(DataErrorsComponent, item)) {
      DataErrorsComponent[item].exist = false
      DataErrorsComponent[item].message = null
    }
  }
}

export { errorsWriting, errorsInitialise }
