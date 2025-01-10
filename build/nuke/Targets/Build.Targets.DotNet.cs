#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

using System.Threading.Tasks;
using Nuke.Common.IO;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

partial class Build
{
    async Task TargetCleanImplementation()
    {
        // SourceDirectory.GlobDirectories("**/bin", "**/obj").ForEach(DeleteDirectory);
        // EnsureCleanDirectory(ArtifactsDirectory);
    }

    async Task TargetRestoreImplementation()
    {
        // DotNetToolRestore();
        // DotNetRestore(s => s
        //     .SetProjectFile(Solution));
    }

    async Task TargetCompileImplementation()
    {
        // DotNetBuild(s => s
        //     .SetProjectFile(Solution)
        //     .SetConfiguration(Configuration)
        //     .SetAssemblyVersion(GitVersion.AssemblySemVer)
        //     .SetFileVersion(GitVersion.AssemblySemFileVer)
        //     .SetInformationalVersion(GitVersion.InformationalVersion)
        //     .EnableNoRestore());
    }

    async Task PublishImplementation()
    {
        // DotNetPublish(s => s
        //     .SetProject(MainProject)
        //     //.SetVersion(GitVersion.FullSemVer)
        //     .SetOutput(BinaryArtifactsDirectory)
        // );
    }
}
