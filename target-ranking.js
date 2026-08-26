// Target status should be informational only and must not inflate player value.
// This overrides the base scoring function after app.js loads.
draftScore=function(p){
  const a=available();
  const max=Math.max(...a.map(x=>x[3]),1);
  return Math.min(100,
    (p[3]/max)*63 +
    posNeed(p[1])*.22 +
    (100-survival(p))*.08
  );
};