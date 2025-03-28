  import { routeLoader$ } from "@builder.io/qwik-city";
  import { useGetDependenciesForRepo } from "../getDependencies";
  export { useGetDependenciesForRepo } from "../getDependencies";
  import metadata from "../../../metadata.json";
  import { Octokit } from "octokit";

  // this gets the package.json for all repos in metadata.json
  // although the package.json must be at the root of the repo or it will not work
  // eslint-disable-next-line qwik/loader-location
  export const useGetPackageJson = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    try {
      const octokit = new Octokit({
        auth: accessToken
      });

      const repos = metadata.dependencyPaths;
      await event.resolveValue(useGetDependenciesForRepo);

      const packageJsons = await Promise.all(
        repos.map(async (repoName) => {
          const { data } = await octokit.rest.repos.getContent({
            owner: metadata.owner,
            repo: repoName,
            path: "package.json"
          });
          return data;
        })
      );
      return packageJsons;
    } catch (error) {
      console.error("Error fetching package.json:", error);
      return [];
    }
  });

          
          
          


          
//           const packageJson = await response.json() as {content: string};
//           const content:PackageJson = JSON.parse(atob(packageJson.content));
 
//           return {
//             devDependencies:content.devDependencies,
//             name: content.name,
//             version: content.version,
//             dependencies: content.dependencies,
//             repo: repo,
//           };
//         } catch (error) {
//           console.error(`Error fetching dependencies for ${repo}:`, error);
//           return {
//             name: '',
//             version: '',
//             dependencies: {},
//             devDependencies: {},
//             repo: repo,
//           } as PackageJson;
//         }
//       }));

//       return packageJsons;
//     } catch (error) {
//       console.error("Error in useGetPackageJson:", error);
//       return [];
//     }
//   });
