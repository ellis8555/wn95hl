function setCORSHeaders(res, allowedOrigins, requestMethod) {
  const requestOrigin = res.getHeader("Origin");
  if (allowedOrigins === "*" || allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Access-Control-Allow-Methods", requestMethod);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

export default setCORSHeaders;
