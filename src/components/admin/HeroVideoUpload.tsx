import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video, Loader2, Trash2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function HeroVideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  // Fetch current hero video URL
  const { data: heroVideoSetting, isLoading } = useQuery({
    queryKey: ['hero-video-url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_video_url')
        .single();
      
      if (error) throw error;
      return data?.setting_value as string | null;
    }
  });

  // Update hero video URL mutation
  const updateVideoUrl = useMutation({
    mutationFn: async (videoUrl: string | null) => {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'hero_video_url',
          setting_value: videoUrl
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-video-url'] });
      toast.success('Hero video updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update video: ${error.message}`);
    }
  });

  // Delete video mutation
  const deleteVideo = useMutation({
    mutationFn: async (videoPath: string) => {
      const { error } = await supabase.storage
        .from('hero-videos')
        .remove([videoPath]);
      
      if (error) throw error;
      
      // Update app_settings to null
      await updateVideoUrl.mutateAsync(null);
    },
    onSuccess: () => {
      toast.success('Video deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete video: ${error.message}`);
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, WebM, MOV, AVI)');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 52428800) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Delete old video if exists
      if (heroVideoSetting) {
        const oldPath = heroVideoSetting.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('hero-videos').remove([oldPath]);
        }
      }

      // Upload new video
      const fileName = `hero-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('hero-videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-videos')
        .getPublicUrl(data.path);

      // Update app settings
      await updateVideoUrl.mutateAsync(publicUrl);
      
      setUploadProgress(100);
      event.target.value = ''; // Reset input
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!heroVideoSetting) return;
    
    const videoPath = heroVideoSetting.split('/').pop();
    if (!videoPath) return;

    if (confirm('Are you sure you want to delete the hero video?')) {
      deleteVideo.mutate(videoPath);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Hero Video Background
        </CardTitle>
        <CardDescription>
          Upload a video to display as the background in the homepage hero section. 
          Maximum file size: 50MB. Supported formats: MP4, WebM, MOV, AVI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Video Preview */}
        {heroVideoSetting && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
              <video
                src={heroVideoSetting}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                <span>Video active</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteVideo.isPending}
              >
                {deleteVideo.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Video
              </Button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            type="file"
            id="video-upload"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="video-upload">
            <Button
              type="button"
              className="w-full"
              disabled={uploading}
              onClick={() => document.getElementById('video-upload')?.click()}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {heroVideoSetting ? 'Replace Video' : 'Upload Video'}
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>

        {uploading && (
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
