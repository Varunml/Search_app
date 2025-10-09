const errorMiddleware = (err, req, res, next) => {
  // r

  if (err.code === "23505") {
    const slicingMessage = err.message;
    let constraint = err.constraint;
    let final = constraint.split(/_/);
    let column = final[1] ? final[1] : "Field";
    // console.log(column);
    let message = `${column.charAt(0).toUpperCase() +column.slice(1)} already exists`;
    res.status(err.statusCode || 500).json({ message: err.message });
    // console.log(message);
    // let message = res.status(err.statusCode || 500).json({ message });
  }

  if(err.code==='23503'){
    const slicing= err.message;
  
  }
};

export default errorMiddleware;
