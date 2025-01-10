#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

using System.Threading.Tasks;
using Nuke.Common.IO;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.PowerShell;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

partial class Build
{
    async Task InstallNetheruemGeneratorImplementation()
    {
        // DotNetToolInstall(s => s
        //   .SetGlobal(true)
        //   .SetPackageName("Nethereum.Generator.Console"));

        PowerShellTasks.PowerShell($"dotnet new classlib -n {MainProjectName}");
        PowerShellTasks.PowerShell($"rm ./{MainProjectName}/class1.cs");
        PowerShellTasks.PowerShell($"cd {MainProjectName}; dotnet add package Nethereum.Web3");
        PowerShellTasks.PowerShell($"Nethereum.Generator.Console generate from-abi -abi ./bin/contracts/Wunder.abi -ns Wunder -o ./{MainProjectName}");
        
    }

    // async Task TargetRestoreImplementation()
    // {
    //     DotNetToolRestore();
    //     DotNetRestore(s => s
    //         .SetProjectFile(Solution));
    // }

    // async Task TargetCompileImplementation()
    // {
    //     DotNetBuild(s => s
    //         .SetProjectFile(Solution)
    //         .SetConfiguration(Configuration)
    //         .SetAssemblyVersion(GitVersion.AssemblySemVer)
    //         .SetFileVersion(GitVersion.AssemblySemFileVer)
    //         .SetInformationalVersion(GitVersion.InformationalVersion)
    //         .EnableNoRestore());
    // }

    // async Task PublishImplementation()
    // {
    //     DotNetPublish(s => s
    //         .SetProject(MainProject)
    //         //.SetVersion(GitVersion.FullSemVer)
    //         .SetOutput(BinaryArtifactsDirectory)
    //     );
    // }
}
