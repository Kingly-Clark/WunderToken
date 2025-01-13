#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

using System;
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
        SourceDirectory.GlobDirectories($"**/{MainProjectName}").ForEach(x => x.DeleteDirectory());
        SourceDirectory.GlobFiles("*.sln").ForEach(x => x.DeleteFile());
        ArtifactsDirectory.CreateOrCleanDirectory();
    }

    async Task TargetRestoreImplementation()
    {
        DotNetToolRestore();
        DotNetRestore(s => s
            .SetProjectFile(MainProjectPath));
    }

    async Task TargetCompileImplementation()
    {
        DotNetBuild(s => s
            .SetProjectFile(MainProjectPath)
            .SetConfiguration(Configuration)
            .SetAssemblyVersion(GitVersion.AssemblySemVer)
            .SetFileVersion(GitVersion.AssemblySemFileVer)
            .SetInformationalVersion(GitVersion.InformationalVersion)
            .EnableNoRestore());
    }
}
