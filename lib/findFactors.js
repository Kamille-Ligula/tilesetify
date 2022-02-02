function findFactors(data) {
  const factors = [];

  for (let i=1; i<=data; i++) {
    if (data % i === 0) {
      factors.push(i);
    }
  }

  return factors;
}

exports.findFactors = findFactors;
