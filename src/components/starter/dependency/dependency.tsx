import {
  component$,
} from "@builder.io/qwik";

interface DependencyProps {
  dependencies: any[];
  packageJsons: any[];
}

export default component$<DependencyProps>(({ dependencies, packageJsons }) => {
  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        {dependencies?.map((dependency, depIndex) => {
          const packageJson = packageJsons[depIndex];
          const repoPackageNames = packageJson?.devDependencies ? Object.keys(packageJson.devDependencies) : [];
          const repoDependencyNames = packageJson?.dependencies ? Object.keys(packageJson.dependencies) : [];
          const allPackageNames = [...repoPackageNames, ...repoDependencyNames];

          if (allPackageNames.length === 0) return null;

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
                {packageJson?.name || dependency.sbom?.name?.split('/').pop() || '-'}
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {[...new Set(allPackageNames)].map((packageName) => {
                  const packageName_str = packageName as string;
                  const packageDetails = dependency.sbom?.packages?.items?.find(
                    (item: { name: string }) => item.name === packageName_str
                  );
                  const isDev = repoPackageNames.includes(packageName_str);
                  const version = isDev 
                    ? packageJson?.devDependencies?.[packageName_str]
                    : packageJson?.dependencies?.[packageName_str] || 
                      packageDetails?.versionInfo || 
                      '-';

                  return (
                    <div key={packageName_str} style={{
                      backgroundColor: 'white',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{fontWeight: 'bold', color: 'black'}}>
                          {packageName_str}
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                          <div style={{
                            fontSize: '0.8rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#e8f5e9',
                            color: '#2e7d32'
                          }}>
                            version: {version}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isDev ? '#e0f7fa' : '#f3e5f5',
                            color: isDev ? '#00838f' : '#7b1fa2'
                          }}>
                            {isDev ? 'dev' : 'prod'}
                          </div>
                        </div>
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
