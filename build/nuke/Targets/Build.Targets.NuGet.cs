#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

using System.Threading.Tasks;
using Nuke.Common.IO;
using Nuke.Common.Tools.DotNet;
using Serilog;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

partial class Build
{
    async Task PackNuGetImplementation()
    {
        // DotNetPack(s => s
        //     .SetProject(OpenApiClientProjectPath)
        //     .SetConfiguration(Configuration)
        //     .SetOutputDirectory(NuGetArtifactsDirectory)
        //     .SetVersion(GitVersion.FullSemVer)
        //     //.EnableNoBuild()
        //     .EnableIncludeSymbols()
        // );
    }

    async Task PushNuGetImplementation()
    {
        // Log.Information("Pushing NuGet");
        // foreach (var file in NuGetArtifactsDirectory.GlobFiles("*.symbols.nupkg"))
        // {
        //     Log.Information("Pushing {0}", file);
        //     DotNetNuGetPush(s => s
        //         .SetSource(NuGetFeed)
        //         .SetTargetPath(file)
        //     );
        // }
    }
}