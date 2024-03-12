function Alert({ children, backgroundColor }) {
  return (
    <div className={`mt-4 px-2 ${backgroundColor ? backgroundColor:'bg-orange-400'} text-white text-center`}>
      {children}
    </div>
  );
}

export default Alert;
