import {
    component$,
    useTask$,
    useStore,
  } from "@builder.io/qwik";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import { useGetDependenciesForRepo } from "../../api/getDependencies";
  import { useGetReposForDependencies } from "../../api/getRepositories";
  export { useGetDependenciesForRepo } from "../../api/getDependencies";
  export { useGetReposForDependencies } from "../../api/getRepositories";
  import { useGetPackageJson } from "../../api/getPackageJson";
  export { useGetPackageJson } from "../../api/getPackageJson";

    
  export default component$(() => {
    useGetReposForDependencies();
    const repoDependencies = useGetDependenciesForRepo();
    const packageJsons = useGetPackageJson();

    const state = useStore({
        count: 0,
        number: 20,
        repos: [],
      });

  
    useTask$(({ cleanup }) => {
      const timeout = setTimeout(() => (state.count = 1), 500);
      cleanup(() => clearTimeout(timeout));
  
      const internal = setInterval(() => state.count++, 7000);
      cleanup(() => clearInterval(internal));
    });
  
    return (
      <div class="container container-center">
        <div role="presentation" class="ellipsis"></div>
        <h1>
          <span class="highlight">Repo</span> Dependencies
        </h1>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {repoDependencies.value?.map((dependency, depIndex) => {
            const repoPackageNames = packageJsons.value[depIndex]?.devDependencies ? Object.keys(packageJsons.value[depIndex].devDependencies) : [];
            // console.log("THE DEPENDENCY FOR THIS REPO", dependency);
            // Skip rendering if no dependencies
            if (repoPackageNames.length === 0) return null;

            return (
              <div key={dependency.sbom?.SPDXID} style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '300px',
                maxWidth: '400px'
              }}>
                <h3 style={{
                  margin: '0 0 1rem 0',
                  color: 'black'
                }}>
                  {dependency.sbom?.name?.split('/').pop() || '-'}
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {[...new Set(repoPackageNames)].map((packageName) => {
                    const packageName_str = packageName as string;
                    //@ts-ignore
                    const packageDetails = dependency.sbom?.packages?.find(
                      (item: { name: string }) => item.name === packageName_str
                    );
                    // console.log("PACKAGE DETAILS", packageDetails);
                    return (
                      <div key={packageName_str} style={{
                        backgroundColor: 'white',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}>
                        <div style={{fontWeight: 'bold', color: 'black'}}>
                          {packageName_str}
                        </div>
                        <div style={{color: '#666', fontSize: '0.9rem'}}>
                          { packageDetails?.versionInfo || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Dependencies",
  };  
  
